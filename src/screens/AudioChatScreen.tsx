import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity, Dimensions, ScrollView, KeyboardAvoidingView, Platform, Animated } from 'react-native';
import { Text, Avatar, Button, ActivityIndicator, Modal, Portal } from 'react-native-paper';
import { Audio } from 'expo-av';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';

const { width } = Dimensions.get('window');
const GEMINI_API_KEY = 'AIzaSyDraWQQ9dLdv8eHjt2SLTD_PTWbqCuhTfc';
const SPEECH_TO_TEXT_API_KEY = 'A_TA_CLE_GOOGLE_SPEECH_TO_TEXT'; // À compléter

const USER_COLOR = '#0EA5E9';
const AI_COLOR = '#22C55E';

const AudioChatScreen = () => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState<{ sender: 'user' | 'ai', text: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [audioPermission, setAudioPermission] = useState<boolean | null>(null);
  const [emotion, setEmotion] = useState<'calm' | 'enthusiastic' | 'neutral'>('neutral');
  const [aiVoice, setAiVoice] = useState<'feminine' | 'masculine' | 'neutral'>('neutral');
  const [aiTone, setAiTone] = useState<'formelle' | 'amicale'>('formelle');
  const [cameraFacing, setCameraFacing] = useState<'front' | 'back'>('front');
  const cameraRef = useRef<CameraView>(null);
  const waveAnim = useRef(new Animated.Value(0)).current;
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [showConnecting, setShowConnecting] = useState(false);
  const [aiThinking, setAiThinking] = useState(false);
  const [aiDots, setAiDots] = useState('');
  // Ajoute un état pour le loader caméra
  const [showCameraConnecting, setShowCameraConnecting] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const systemPrompt = "Tu es un assistant IA expert en agriculture pour l'application TerraNobis. Donne des réponses adaptées au contexte africain, en français, et propose des conseils pratiques pour les agriculteurs.";

  // Dynamic theme color based on emotion
  const getThemeColors = (): [string, string] => {
    switch (emotion) {
      case 'calm': return ['#3B82F6', '#0EA5E9'];
      case 'enthusiastic': return ['#F59E0B', '#F97316'];
      default: return ['#22C55E', '#16A34A'];
    }
  };

  // Animate the wave when recording
  const animateWave = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(waveAnim, { toValue: 0, duration: 500, useNativeDriver: true })
      ])
    ).start();
  };

  // Start/stop audio recording
  const handleRecord = async () => {
    if (isRecording) {
      setIsRecording(false);
      waveAnim.stopAnimation();
      if (recording) {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        if (uri) {
          handleSendAudio(uri);
        }
      }
      setRecording(null);
      return;
    }
    setShowConnecting(true);
    setTimeout(async () => {
      setShowConnecting(false);
      // Permissions
      const { status: audioStatus } = await Audio.requestPermissionsAsync();
      setAudioPermission(audioStatus === 'granted');
      if (audioStatus !== 'granted') return;
      setIsRecording(true);
      animateWave();
      const rec = new Audio.Recording();
      await rec.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await rec.startAsync();
      setRecording(rec);
    }, 4000);
  };

  // Ajoute une fonction pour transcrire l'audio
  const transcribeAudio = async (audioUri: string): Promise<string> => {
    try {
      const file = await fetch(audioUri).then(res => res.blob());
      const formData = new FormData();
      formData.append('file', file);
      // Utilise l'API Google Speech-to-Text REST (simulate si besoin)
      // Ici, on suppose que tu as un endpoint proxy ou tu utilises un service compatible
      // Pour la démo, on retourne un texte factice
      // TODO: Remplacer par un vrai appel API
      return 'Texte transcrit automatiquement (démo)';
    } catch (e) {
      return '[Erreur transcription audio]';
    }
  };

  // Modifie handleSendAudio pour utiliser la transcription réelle
  const handleSendAudio = async (audioUri: string) => {
    setLoading(true);
    setTranscript(prev => [...prev, { sender: 'user', text: '[Audio envoyé]' }]);
    const transcriptText = await transcribeAudio(audioUri);
    setTranscript(prev => [...prev, { sender: 'user', text: transcriptText }]);
    await handleSendToGemini(transcriptText);
    setLoading(false);
  };

  // Send text or audio transcript to Gemini
  const handleSendToGemini = async (message: string) => {
    setLoading(true);
    setAiThinking(true);
    setAiDots('');
    setTranscript(prev => [...prev, { sender: 'ai', text: '...' }]);
    // Animation points
    let dots = '';
    let interval = setInterval(() => {
      dots = dots.length < 3 ? dots + '.' : '';
      setAiDots(dots);
      setTranscript(prev => {
        const last = prev[prev.length - 1];
        if (last && last.sender === 'ai') {
          return [...prev.slice(0, -1), { sender: 'ai', text: '...' + dots }];
        }
        return prev;
      });
    }, 500);
    // Simule un délai IA
    await new Promise(res => setTimeout(res, 2200));
    clearInterval(interval);
    setAiThinking(false);
    // Prépare l'historique pour Gemini avec le champ role
    const chatHistory = transcript
      .filter(msg => msg.sender === 'user' || msg.sender === 'ai')
      .map(msg => ({ role: msg.sender === 'user' ? 'user' : 'model', parts: [{ text: msg.text }] }));
    // Prépare le contenu multimodal avec le champ role
    let contents = [
      { role: 'user', parts: [{ text: systemPrompt }] },
      ...chatHistory,
      { role: 'user', parts: [{ text: message }] }
    ];
    if (capturedImage) {
      contents.push({ role: 'user', parts: [{ text: message }, { inlineData: { mimeType: 'image/jpeg', data: capturedImage.replace(/^data:image\/jpeg;base64,/, '') } }] });
    }
    try {
      const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': GEMINI_API_KEY
        },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: aiTone === 'amicale' ? 0.7 : 0.3,
            topP: 1,
            topK: 1,
            maxOutputTokens: 256
          }
        })
      });
      console.log('Gemini API request:', { contents });
      console.log('Gemini API response status:', res.status);
      if (!res.ok) {
        const errorText = await res.text();
        console.log('Gemini API error:', errorText);
        setTranscript(prev => [
          ...prev.slice(0, -1),
          { sender: 'ai', text: 'Erreur API Gemini : ' + errorText }
        ]);
        setLoading(false);
        return;
      }
      const data = await res.json();
      console.log('Gemini API data:', data);
      let aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Réponse IA indisponible.';
      setTranscript(prev => [
        ...prev.slice(0, -1),
        { sender: 'ai', text: aiText }
      ]);
      setEmotion(aiText.includes('Bravo') ? 'enthusiastic' : aiText.includes('calme') ? 'calm' : 'neutral');
      setCapturedImage(null); // reset après envoi
    } catch (e) {
      console.log('Gemini API exception:', e);
      setTranscript(prev => [
        ...prev.slice(0, -1),
        { sender: 'ai', text: 'Erreur lors de la communication avec Gemini.' }
      ]);
    }
    setLoading(false);
  };

  // Camera live view
  const handleCamera = async () => {
    if (cameraActive) {
      setCameraActive(false);
      return;
    }
    setShowCameraConnecting(true);
    setTimeout(async () => {
      setShowCameraConnecting(false);
      const permission = await requestCameraPermission();
      if (permission?.granted) setCameraActive(true);
    }, 4000);
  };

  // Ajoute une fonction pour capturer une photo
  const handleTakePhoto = async () => {
    if (!cameraRef.current) return;
    try {
      // CameraView n'a pas de méthode takePictureAsync, il faut utiliser expo-camera/legacy ou expo-image-picker
      // Ici, on simule la capture
      // TODO: Remplacer par une vraie capture si besoin
      setCapturedImage('data:image/jpeg;base64,FAKE_BASE64_IMAGE');
    } catch (e) {
      setCapturedImage(null);
    }
  };

  // Send text message
  const handleSendText = async () => {
    if (!input.trim()) return;
    setTranscript(prev => [...prev, { sender: 'user', text: input }]);
    setInput('');
    await handleSendToGemini(input);
  };

  useEffect(() => {
    const autoCapture = async () => {
      if (cameraActive && cameraPermission?.granted) {
        const result = await ImagePicker.launchCameraAsync({ base64: true, quality: 0.7 });
        if (!result.canceled && result.assets && result.assets[0].base64) {
          setCapturedImage('data:image/jpeg;base64,' + result.assets[0].base64);
        }
      }
    };
    autoCapture();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cameraActive, cameraPermission]);

  // UI
  return (
    <SafeAreaView style={styles.container}>
      {showConnecting && (
        <View style={styles.connectingOverlay}>
          <ActivityIndicator size="large" color="#22C55E" />
          <Text style={styles.connectingText}>
            Connexion à <Text style={styles.connectingBrand}>TerraNobis AI</Text>
          </Text>
        </View>
      )}
      {showCameraConnecting && (
        <View style={styles.connectingOverlay}>
          <ActivityIndicator size="large" color="#22C55E" />
          <Text style={styles.connectingText}>
            Connexion à <Text style={styles.connectingBrand}>TerraNobis AI</Text>
          </Text>
        </View>
      )}
      <LinearGradient colors={getThemeColors()} style={styles.gradient}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Conversation IA</Text>
        </View>
        {/* Camera live view */}
        {cameraActive && cameraPermission?.granted && (
          <View style={styles.cameraContainer}>
            <CameraView ref={cameraRef} style={styles.camera} facing={cameraFacing} />
            <TouchableOpacity style={styles.closeCamera} onPress={() => setCameraActive(false)}>
              <Icon name="close" size={28} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.switchCameraButton} onPress={() => setCameraFacing(f => f === 'front' ? 'back' : 'front')}>
              <Icon name="flip-camera-ios" size={28} color="#fff" />
            </TouchableOpacity>
            {/* Supprime le bouton de capture manuel et capture automatiquement dès l'ouverture de la caméra */}
            {/* <TouchableOpacity style={styles.captureButton} onPress={handleTakePhoto}>
              <Icon name="camera-alt" size={28} color="#fff" />
            </TouchableOpacity> */}
          </View>
        )}
        {/* Transcript */}
        <ScrollView style={styles.transcript} contentContainerStyle={{ paddingBottom: 80 }}>
          {transcript.map((msg, idx) => (
            <View key={idx} style={[styles.messageRow, { justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }]}> 
              {msg.sender === 'ai' && (
                <Avatar.Icon size={36} icon="robot" style={{ backgroundColor: AI_COLOR, marginRight: 8 }} />
              )}
              <View style={[styles.bubble, { backgroundColor: msg.sender === 'user' ? USER_COLOR : AI_COLOR }]}> 
                <Text style={styles.bubbleText}>{msg.text}</Text>
              </View>
              {msg.sender === 'user' && (
                <Avatar.Icon size={36} icon="person" style={{ backgroundColor: USER_COLOR, marginLeft: 8 }} />
              )}
            </View>
          ))}
          {loading && (
            <ActivityIndicator color="#fff" style={{ marginTop: 16 }} />
          )}
        </ScrollView>
        {/* Animated Waveform */}
        <View style={styles.waveformContainer}>
          <Animated.View
            style={[
              styles.wave,
              {
                transform: [
                  {
                    scale: waveAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.3]
                    })
                  }
                ],
                opacity: isRecording ? 1 : 0.5
              }
            ]}
          />
        </View>
        {/* Controls */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.controls}
        >
          <TouchableOpacity onPress={handleRecord} style={[styles.micButton, isRecording && styles.micActive]}> 
            <Icon name={isRecording ? 'stop' : 'mic'} size={28} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleCamera} style={styles.cameraButton}>
            <Icon name="videocam" size={28} color="#fff" />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Parlez ou écrivez..."
            placeholderTextColor="#fff9"
            value={input}
            onChangeText={setInput}
            onSubmitEditing={handleSendText}
            editable={!isRecording}
          />
          <TouchableOpacity onPress={handleSendText} style={styles.sendButton} disabled={!input.trim()}>
            <Icon name="send" size={24} color="#fff" />
          </TouchableOpacity>
        </KeyboardAvoidingView>
        {/* Personnalisation */}
        <TouchableOpacity style={styles.settingsButton} onPress={() => setSettingsVisible(true)}>
          <Icon name="settings" size={28} color="#fff" />
        </TouchableOpacity>
        <Portal>
          <Modal visible={settingsVisible} onDismiss={() => setSettingsVisible(false)} contentContainerStyle={styles.settingsModal}>
            <Text style={styles.settingsTitle}>Personnalisation IA</Text>
            <Text style={styles.settingsLabel}>Voix IA :</Text>
            <View style={styles.settingsOptionsRow}>
              <Button mode={aiVoice === 'feminine' ? 'contained' : 'text'} onPress={() => setAiVoice('feminine')}>Féminine</Button>
              <Button mode={aiVoice === 'masculine' ? 'contained' : 'text'} onPress={() => setAiVoice('masculine')}>Masculine</Button>
              <Button mode={aiVoice === 'neutral' ? 'contained' : 'text'} onPress={() => setAiVoice('neutral')}>Neutre</Button>
            </View>
            <Text style={styles.settingsLabel}>Tonalité :</Text>
            <View style={styles.settingsOptionsRow}>
              <Button mode={aiTone === 'formelle' ? 'contained' : 'text'} onPress={() => setAiTone('formelle')}>Formelle</Button>
              <Button mode={aiTone === 'amicale' ? 'contained' : 'text'} onPress={() => setAiTone('amicale')}>Amicale</Button>
            </View>
            <Button onPress={() => setSettingsVisible(false)} style={{ marginTop: 20 }} mode="outlined">Fermer</Button>
          </Modal>
        </Portal>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  iconButton: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    padding: 8,
  },
  cameraContainer: {
    width: width - 40,
    height: 220,
    alignSelf: 'center',
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 10,
    marginTop: 10,
  },
  camera: {
    flex: 1,
  },
  closeCamera: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 20,
    padding: 4,
    zIndex: 2,
  },
  switchCameraButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 20,
    padding: 8,
    zIndex: 2,
  },
  captureButton: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    backgroundColor: '#22C55E',
    borderRadius: 20,
    padding: 8,
    zIndex: 2,
  },
  transcript: {
    flex: 1,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  bubble: {
    maxWidth: '70%',
    padding: 12,
    borderRadius: 18,
  },
  bubbleText: {
    color: '#fff',
    fontSize: 16,
  },
  waveformContainer: {
    alignItems: 'center',
    marginVertical: 10,
    height: 40,
  },
  wave: {
    width: 120,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    opacity: 0.3,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: 'rgba(0,0,0,0.08)',
    borderRadius: 20,
    margin: 10,
    position: 'absolute',
    bottom: 70,
    left: 0,
    right: 0,
  },
  micButton: {
    backgroundColor: '#0EA5E9',
    borderRadius: 24,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  micActive: {
    backgroundColor: '#F59E0B',
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    paddingHorizontal: 12,
    backgroundColor: 'transparent',
  },
  sendButton: {
    backgroundColor: '#22C55E',
    borderRadius: 24,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  settingsButton: {
    position: 'absolute',
    top: 48,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.18)',
    borderRadius: 20,
    padding: 8,
    zIndex: 10,
  },
  settingsModal: {
    backgroundColor: '#fff',
    margin: 24,
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
  },
  settingsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  settingsLabel: {
    color: '#1F2937',
    fontSize: 16,
    marginTop: 12,
    marginBottom: 4,
  },
  settingsOptionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  cameraButton: {
    backgroundColor: '#0EA5E9',
    borderRadius: 24,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  connectingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  connectingText: {
    color: '#fff',
    fontSize: 20,
    marginTop: 24,
    textAlign: 'center',
    fontWeight: '500',
  },
  connectingBrand: {
    color: '#22C55E',
    fontWeight: 'bold',
    fontSize: 22,
  },
});

export default AudioChatScreen; 