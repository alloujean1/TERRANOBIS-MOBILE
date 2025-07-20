import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity, Image } from 'react-native';
import { Text, Card, Button, TextInput, ProgressBar, IconButton } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';

const SoilAnalysisScreen = () => {
  const [analysisType, setAnalysisType] = useState<'choice' | 'sensors' | 'manual'>('choice');
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    location: '',
    superficie: '',
    soilType: '',
    photos: [] as any[],
    videos: [] as any[]
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  const soilTypes = [
    'Sols ferrugineux tropicaux',
    'Sols ferralitiques',
    'Sols hydromorphes',
    'Sols sablo-argileux',
    'Sols sablonneux'
  ];

  const steps = [
    { id: 1, title: 'Informations de base', fields: ['location', 'superficie'] },
    { id: 2, title: 'Type de sol', fields: ['soilType'] },
    { id: 3, title: 'Photos et vidéos', fields: ['photos', 'videos'] },
    { id: 4, title: 'Résultats', fields: [] }
  ];

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep === 3) {
      handleAnalysis();
    } else if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const simulateSensorAnalysis = () => {
    setLoading(true);
    
    // Simulation de lecture des capteurs
    const sensorData = {
      temperature: Math.floor(Math.random() * 15) + 20, // 20-35°C
      humidity: Math.floor(Math.random() * 30) + 40, // 40-70%
      ph: (Math.random() * 2 + 5.5).toFixed(1), // 5.5-7.5
      nitrogen: Math.floor(Math.random() * 50) + 30, // 30-80 mg/kg
      phosphorus: Math.floor(Math.random() * 40) + 20, // 20-60 mg/kg
      potassium: Math.floor(Math.random() * 60) + 40, // 40-100 mg/kg
    };

    setTimeout(() => {
      const results = generateAnalysisResults(sensorData);
      setResults(results);
      setLoading(false);
      setCurrentStep(4);
    }, 3000);
  };

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissions requises', 'Nous avons besoin d\'accéder à votre galerie');
      return false;
    }
    return true;
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const newPhoto = {
        uri: result.assets[0].uri,
        type: 'photo',
        timestamp: new Date().toISOString()
      };
      updateFormData('photos', [...formData.photos, newPhoto]);
    }
  };

  const takeVideo = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const newVideo = {
        uri: result.assets[0].uri,
        type: 'video',
        timestamp: new Date().toISOString()
      };
      updateFormData('videos', [...formData.videos, newVideo]);
    }
  };

  const importMedia = async (type: 'photo' | 'video') => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: type === 'photo' ? ImagePicker.MediaTypeOptions.Images : ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const newMedia = {
        uri: result.assets[0].uri,
        type: type,
        timestamp: new Date().toISOString()
      };
      
      if (type === 'photo') {
        updateFormData('photos', [...formData.photos, newMedia]);
      } else {
        updateFormData('videos', [...formData.videos, newMedia]);
      }
    }
  };

  const removePhoto = (index: number) => {
    const newPhotos = formData.photos.filter((_, i) => i !== index);
    updateFormData('photos', newPhotos);
  };

  const removeVideo = (index: number) => {
    const newVideos = formData.videos.filter((_, i) => i !== index);
    updateFormData('videos', newVideos);
  };

  const generateAnalysisResults = (sensorData?: any) => {
    const soilType = formData.soilType || 'Sols ferrugineux tropicaux';
    const superficie = parseFloat(formData.superficie) || 1;
    
    // Données simulées basées sur le type de sol
    const soilData = {
      'Sols ferrugineux tropicaux': {
        ph: 6.2,
        nitrogen: 45,
        phosphorus: 35,
        potassium: 65,
        quality: 'Bonne',
        recommendations: ['Mil', 'Sorgho', 'Arachide', 'Niébé'],
        improvements: ['Ajout de compost organique', 'Rotation des cultures'],
        yield: 1.2
      },
      'Sols ferralitiques': {
        ph: 5.8,
        nitrogen: 35,
        phosphorus: 25,
        potassium: 55,
        quality: 'Moyenne',
        recommendations: ['Manioc', 'Igname', 'Taro', 'Banane'],
        improvements: ['Apport d\'engrais phosphatés', 'Irrigation goutte à goutte'],
        yield: 0.9
      },
      'Sols hydromorphes': {
        ph: 6.8,
        nitrogen: 55,
        phosphorus: 45,
        potassium: 75,
        quality: 'Excellente',
        recommendations: ['Riz', 'Canne à sucre', 'Légumes verts'],
        improvements: ['Drainage amélioré', 'Engrais azotés'],
        yield: 1.5
      },
      'Sols sablo-argileux': {
        ph: 6.5,
        nitrogen: 40,
        phosphorus: 30,
        potassium: 60,
        quality: 'Bonne',
        recommendations: ['Maïs', 'Haricot', 'Tomate', 'Piment'],
        improvements: ['Irrigation régulière', 'Paillage'],
        yield: 1.1
      },
      'Sols sablonneux': {
        ph: 6.0,
        nitrogen: 30,
        phosphorus: 20,
        potassium: 45,
        quality: 'Faible',
        recommendations: ['Pastèque', 'Melon', 'Patate douce'],
        improvements: ['Apport de matière organique', 'Irrigation fréquente'],
        yield: 0.7
      }
    };

    const data = soilData[soilType] || soilData['Sols ferrugineux tropicaux'];
    
    return {
      soilQuality: data.quality,
      ph: data.ph,
      nutrients: {
        nitrogen: data.nitrogen,
        phosphorus: data.phosphorus,
        potassium: data.potassium
      },
      recommendations: data.recommendations.map(crop => ({
        crop,
        suitability: Math.floor(Math.random() * 20) + 80,
        expectedYield: `${(data.yield * (Math.random() * 0.3 + 0.85)).toFixed(1)} tonnes/hectare`,
        marketDemand: ['Élevée', 'Très élevée', 'Moyenne'][Math.floor(Math.random() * 3)],
        tips: [
          'Plantation après les premières pluies',
          'Espacement recommandé: 30-40cm',
          'Surveillance des parasites'
        ]
      })),
      improvements: data.improvements,
      estimatedYield: data.yield * superficie,
      superficie: superficie
    };
  };

  const handleAnalysis = async () => {
    if (!formData.location || !formData.superficie || !formData.soilType) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);
    
    // Simulation de l'analyse IA
    setTimeout(() => {
      const results = generateAnalysisResults();
      setResults(results);
      setLoading(false);
      setCurrentStep(4);
    }, 3000);
  };

  const handleDownload = () => {
    Alert.alert(
      'Téléchargement',
      'Rapport d\'analyse en cours de téléchargement...',
      [{ text: 'OK' }]
    );
    // Simulation du téléchargement
    setTimeout(() => {
      Alert.alert('Succès', 'Rapport téléchargé avec succès !');
    }, 2000);
  };

  const handleInvestment = () => {
    Alert.alert(
      'Investissement',
      'Voulez-vous mettre cette analyse en investissement ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Confirmer', 
          onPress: () => {
            Alert.alert('Succès', 'Analyse mise en investissement !');
          }
        }
      ]
    );
  };

  const handleBackToChoice = () => {
    setAnalysisType('choice');
    setCurrentStep(1);
    setFormData({
      location: '',
      superficie: '',
      soilType: '',
      photos: [],
      videos: []
    });
    setResults(null);
  };

  const renderChoiceScreen = () => (
    <View style={styles.choiceContainer}>
      <Text style={styles.choiceTitle}>Choisissez votre méthode d'analyse</Text>
      
      <TouchableOpacity
        style={styles.choiceCard}
        onPress={() => setAnalysisType('sensors')}
      >
        <Icon name="sensors" size={48} color="#0EA5E9" />
        <Text style={styles.choiceCardTitle}>Analyse par capteurs</Text>
        <Text style={styles.choiceCardSubtitle}>
          Utilisez nos capteurs connectés pour une analyse automatique
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.choiceCard}
        onPress={() => setAnalysisType('manual')}
      >
        <Icon name="edit" size={48} color="#22C55E" />
        <Text style={styles.choiceCardTitle}>Analyse manuelle</Text>
        <Text style={styles.choiceCardSubtitle}>
          Remplissez le formulaire et ajoutez vos photos
            </Text>
      </TouchableOpacity>
          </View>
  );

  const renderSensorAnalysis = () => (
    <View style={styles.sensorContainer}>
      <Text style={styles.sensorTitle}>Analyse par capteurs</Text>
      <Text style={styles.sensorSubtitle}>Lecture des données en cours...</Text>
      
      <View style={styles.sensorAnimation}>
        <Icon name="sensors" size={64} color="#0EA5E9" />
        <ProgressBar progress={loading ? undefined : 1} color="#0EA5E9" style={styles.progressBar} />
      </View>

      {loading && (
        <View style={styles.sensorData}>
          <Text style={styles.sensorDataText}>📊 Collecte des données...</Text>
          <Text style={styles.sensorDataText}>🌡️ Température: 28°C</Text>
          <Text style={styles.sensorDataText}>💧 Humidité: 65%</Text>
          <Text style={styles.sensorDataText}>🧪 pH: 6.2</Text>
        </View>
      )}

      <Button
        mode="contained"
        onPress={simulateSensorAnalysis}
        loading={loading}
        disabled={loading}
        style={styles.analyzeButton}
      >
        {loading ? 'Analyse en cours...' : 'Démarrer l\'analyse'}
      </Button>
    </View>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Informations de base</Text>
              
              <TextInput
              label="Localisation *"
              value={formData.location}
              onChangeText={(text) => updateFormData('location', text)}
                mode="outlined"
                placeholder="Ex: Thiès, Sénégal"
                style={styles.input}
                left={<TextInput.Icon icon="map-marker" />}
              />

              <TextInput
              label="Superficie (hectares) *"
              value={formData.superficie}
              onChangeText={(text) => updateFormData('superficie', text)}
                mode="outlined"
              placeholder="Ex: 2.5"
              keyboardType="numeric"
                style={styles.input}
              left={<TextInput.Icon icon="crop-square" />}
            />
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Type de sol</Text>
            <Text style={styles.stepSubtitle}>Sélectionnez le type de sol de votre terrain</Text>
            
            {soilTypes.map((type, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.soilTypeCard,
                  formData.soilType === type && styles.soilTypeCardSelected
                ]}
                onPress={() => updateFormData('soilType', type)}
              >
                <Text style={[
                  styles.soilTypeText,
                  formData.soilType === type && styles.soilTypeTextSelected
                ]}>
                  {type}
                </Text>
                {formData.soilType === type && (
                  <Icon name="check-circle" size={24} color="#22C55E" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Photos et vidéos</Text>
            <Text style={styles.stepSubtitle}>Ajoutez des médias pour une analyse plus précise</Text>

            {/* Photos */}
            <View style={styles.mediaSection}>
              <Text style={styles.mediaTitle}>Photos du sol</Text>
              <View style={styles.mediaButtons}>
                <Button
                  mode="contained"
                  onPress={takePhoto}
                  style={styles.mediaButton}
                  icon="camera"
                >
                  Prendre photo
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => importMedia('photo')}
                  style={styles.mediaButton}
                  icon="image"
                >
                  Importer
                </Button>
              </View>

              {formData.photos.length > 0 && (
                <View style={styles.mediaPreviewContainer}>
                  <Text style={styles.mediaCount}>{formData.photos.length} photo(s) sélectionnée(s)</Text>
                  <ScrollView horizontal style={styles.mediaPreview} showsHorizontalScrollIndicator={false}>
                    {formData.photos.map((photo, index) => (
                      <View key={index} style={styles.previewItem}>
                        <Image source={{ uri: photo.uri }} style={styles.previewImage} />
                        <IconButton
                          icon="close"
                          size={20}
                          iconColor="#FFFFFF"
                          style={styles.removeButton}
                          onPress={() => removePhoto(index)}
                        />
                      </View>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Vidéos */}
            <View style={styles.mediaSection}>
              <Text style={styles.mediaTitle}>Vidéos du terrain</Text>
              <View style={styles.mediaButtons}>
              <Button
                mode="contained"
                  onPress={takeVideo}
                  style={styles.mediaButton}
                  icon="videocam"
                >
                  Filmer
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => importMedia('video')}
                  style={styles.mediaButton}
                  icon="video-library"
                >
                  Importer
              </Button>
        </View>

              {formData.videos.length > 0 && (
                <View style={styles.mediaPreviewContainer}>
                  <Text style={styles.mediaCount}>{formData.videos.length} vidéo(s) sélectionnée(s)</Text>
                  <ScrollView horizontal style={styles.mediaPreview} showsHorizontalScrollIndicator={false}>
                    {formData.videos.map((video, index) => (
                      <View key={index} style={styles.previewItem}>
                        <View style={styles.videoPreview}>
                          <Icon name="play-circle" size={40} color="#FFFFFF" />
                          <Text style={styles.videoLabel}>Vidéo {index + 1}</Text>
                        </View>
                        <IconButton
                          icon="close"
                          size={20}
                          iconColor="#FFFFFF"
                          style={styles.removeButton}
                          onPress={() => removeVideo(index)}
                        />
                      </View>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Résumé des médias */}
            {(formData.photos.length > 0 || formData.videos.length > 0) && (
              <Card style={styles.summaryCard}>
              <Card.Content>
                  <Text style={styles.summaryTitle}>Résumé des médias</Text>
                  <View style={styles.summaryRow}>
                    <Icon name="image" size={20} color="#3B82F6" />
                    <Text style={styles.summaryText}>{formData.photos.length} photo(s)</Text>
                  </View>
                  <View style={styles.summaryRow}>
                    <Icon name="videocam" size={20} color="#22C55E" />
                    <Text style={styles.summaryText}>{formData.videos.length} vidéo(s)</Text>
                  </View>
              </Card.Content>
            </Card>
            )}
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Résultats de l'analyse</Text>
            
            {loading && (
              <View style={styles.loadingContainer}>
                <Icon name="psychology" size={48} color="#22C55E" />
                <Text style={styles.loadingText}>Analyse IA en cours...</Text>
          </View>
        )}

        {results && (
          <View style={styles.resultsContainer}>
                {/* Qualité du sol */}
            <Card style={styles.resultCard}>
              <Card.Content>
                    <Text style={styles.resultTitle}>Qualité du sol</Text>
                    <View style={styles.qualityIndicator}>
                      <Text style={styles.qualityText}>{results.soilQuality}</Text>
                      <View style={[styles.qualityBadge, { backgroundColor: getQualityColor(results.soilQuality) }]}>
                        <Icon name="check-circle" size={20} color="#FFFFFF" />
                  </View>
                </View>
              </Card.Content>
            </Card>

                {/* Recommandations */}
            <Card style={styles.resultCard}>
              <Card.Content>
                    <Text style={styles.resultTitle}>Cultures recommandées</Text>
                    {results.recommendations.map((rec, index) => (
                  <View key={index} style={styles.recommendationItem}>
                    <View style={styles.recommendationHeader}>
                      <Text style={styles.recommendationCrop}>{rec.crop}</Text>
                          <Text style={styles.recommendationSuitability}>{rec.suitability}% adapté</Text>
                      </View>
                        <Text style={styles.recommendationYield}>Rendement: {rec.expectedYield}</Text>
                        <Text style={styles.recommendationDemand}>Demande: {rec.marketDemand}</Text>
                  </View>
                ))}
              </Card.Content>
            </Card>

                {/* Améliorations */}
            <Card style={styles.resultCard}>
              <Card.Content>
                    <Text style={styles.resultTitle}>Améliorations suggérées</Text>
                    {results.improvements.map((improvement, index) => (
                      <Text key={index} style={styles.improvementItem}>• {improvement}</Text>
                ))}
              </Card.Content>
            </Card>

                {/* Rendement estimé */}
                <Card style={styles.resultCard}>
                  <Card.Content>
                    <Text style={styles.resultTitle}>Rendement estimé</Text>
                    <Text style={styles.yieldText}>
                      {results.estimatedYield.toFixed(1)} tonnes pour {results.superficie} hectare(s)
                    </Text>
                  </Card.Content>
                </Card>

                {/* Actions */}
            <View style={styles.actionsContainer}>
              <Button
                mode="contained"
                    onPress={handleDownload}
                    style={[styles.actionButton, styles.downloadButton]}
                    icon="download"
              >
                    Télécharger
              </Button>
                  
              <Button
                    mode="contained"
                    onPress={handleInvestment}
                    style={[styles.actionButton, styles.investmentButton]}
                    icon="trending-up"
              >
                    Mettre en investissement
              </Button>
            </View>
          </View>
        )}
          </View>
        );

      default:
        return null;
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'Excellente': return '#22C55E';
      case 'Bonne': return '#0EA5E9';
      case 'Moyenne': return '#F59E0B';
      case 'Faible': return '#EF4444';
      default: return '#6B7280';
    }
  };

  if (analysisType === 'choice') {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#3B82F6', '#1D4ED8']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <Icon name="psychology" size={48} color="#FFFFFF" />
            <Text style={styles.headerTitle}>Diagnostic Agricole IA</Text>
            <Text style={styles.headerSubtitle}>
              Choisissez votre méthode d'analyse
            </Text>
          </View>
        </LinearGradient>
        {renderChoiceScreen()}
      </SafeAreaView>
    );
  }

  if (analysisType === 'sensors') {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#3B82F6', '#1D4ED8']}
          style={styles.header}
        >
          <View style={styles.headerTop}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackToChoice}
            >
              <Icon name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.headerContent}>
            <Icon name="sensors" size={48} color="#FFFFFF" />
            <Text style={styles.headerTitle}>Analyse par capteurs</Text>
            <Text style={styles.headerSubtitle}>
              Lecture automatique des données
            </Text>
          </View>
        </LinearGradient>
        {renderSensorAnalysis()}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={['#3B82F6', '#1D4ED8']}
          style={styles.header}
        >
          <View style={styles.headerTop}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBackToChoice}
            >
              <Icon name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.headerContent}>
            <Icon name="psychology" size={48} color="#FFFFFF" />
            <Text style={styles.headerTitle}>Diagnostic Agricole IA</Text>
            <Text style={styles.headerSubtitle}>
              Étape {currentStep} sur {steps.length}
            </Text>
          </View>
        </LinearGradient>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <ProgressBar 
            progress={currentStep / steps.length} 
            color="#22C55E" 
            style={styles.progressBar}
          />
          <View style={styles.stepsIndicator}>
            {steps.map((step) => (
              <View 
                key={step.id} 
                style={[
                  styles.stepIndicator,
                  currentStep >= step.id && styles.stepIndicatorActive
                ]}
              >
                <Text style={[
                  styles.stepNumber,
                  currentStep >= step.id && styles.stepNumberActive
                ]}>
                  {step.id}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Step Content */}
        <View style={styles.contentContainer}>
          {renderStepContent()}
        </View>

        {/* Navigation Buttons */}
        <View style={styles.navigationContainer}>
          <Button
            mode="text"
            onPress={handleBack}
            disabled={currentStep === 1}
            style={styles.navButton}
          >
            Retour
          </Button>
          
          <Button
            mode="contained"
            onPress={handleNext}
            loading={loading}
            disabled={loading}
            style={styles.navButton}
          >
            {currentStep === 3 ? 'Analyser' : 'Suivant'}
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '100%',
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 12,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 8,
    opacity: 0.9,
  },
  choiceContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  choiceTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 40,
  },
  choiceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  choiceCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  choiceCardSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  sensorContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sensorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  sensorSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 40,
  },
  sensorAnimation: {
    alignItems: 'center',
    marginBottom: 40,
  },
  sensorData: {
    marginBottom: 40,
  },
  sensorDataText: {
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 8,
  },
  analyzeButton: {
    borderRadius: 12,
    backgroundColor: '#0EA5E9',
  },
  progressContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 16,
  },
  stepsIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepIndicatorActive: {
    borderColor: '#22C55E',
    backgroundColor: '#22C55E',
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6B7280',
  },
  stepNumberActive: {
    color: '#FFFFFF',
  },
  contentContainer: {
    padding: 20,
  },
  stepContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    elevation: 2,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  input: {
    marginBottom: 16,
  },
  soilTypeCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  soilTypeCardSelected: {
    borderColor: '#22C55E',
    backgroundColor: '#F0FDF4',
  },
  soilTypeText: {
    fontSize: 16,
    color: '#1F2937',
  },
  soilTypeTextSelected: {
    color: '#22C55E',
    fontWeight: 'bold',
  },
  mediaSection: {
    marginBottom: 24,
  },
  mediaTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  mediaButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  mediaButton: {
    flex: 1,
  },
  mediaPreviewContainer: {
    marginTop: 16,
  },
  mediaCount: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    fontWeight: '500',
  },
  mediaPreview: {
    flexDirection: 'row',
    gap: 12,
  },
  previewItem: {
    position: 'relative',
  },
  previewImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  videoPreview: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#1F2937',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 4,
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#EF4444',
    margin: 0,
  },
  summaryCard: {
    marginTop: 20,
    elevation: 2,
    borderRadius: 12,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 12,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 16,
  },
  resultsContainer: {
    gap: 16,
  },
  resultCard: {
    elevation: 2,
    borderRadius: 12,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  qualityIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  qualityText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  qualityBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recommendationItem: {
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginBottom: 12,
  },
  recommendationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recommendationCrop: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  recommendationSuitability: {
    fontSize: 14,
    color: '#22C55E',
    fontWeight: 'bold',
  },
  recommendationYield: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  recommendationDemand: {
    fontSize: 14,
    color: '#6B7280',
  },
  improvementItem: {
    fontSize: 14,
    color: '#1F2937',
    marginBottom: 8,
    lineHeight: 20,
  },
  yieldText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#22C55E',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
  },
  downloadButton: {
    backgroundColor: '#0EA5E9',
  },
  investmentButton: {
    backgroundColor: '#22C55E',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  navButton: {
    minWidth: 100,
  },
});

export default SoilAnalysisScreen;