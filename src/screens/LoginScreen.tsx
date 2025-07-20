import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, TextInput, Button, Card } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../contexts/AuthContext';

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      // Redirection vers Dashboard après connexion réussie
      navigation.replace('MainTabs');
    } catch (error) {
      Alert.alert('Erreur', 'Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    Alert.alert('Connexion Google', 'Fonctionnalité à implémenter');
  };

  const handleFacebookLogin = () => {
    Alert.alert('Connexion Facebook', 'Fonctionnalité à implémenter');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header avec dégradé */}
        <LinearGradient
          colors={['#0EA5E9', '#22C55E', '#16A34A']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View style={styles.logo}>
            <Icon name="agriculture" size={48} color="#FFFFFF" />
            </View>
          </View>
        </LinearGradient>

        {/* Formulaire dans carte blanche */}
        <View style={styles.formContainer}>
          <Card style={styles.formCard}>
            <Card.Content style={styles.formContent}>
              <Text style={styles.greeting}>Bonjour !</Text>
              
              {/* Boutons de connexion sociale */}
              <View style={styles.socialButtons}>
                <Button
                  mode="outlined"
                  onPress={handleGoogleLogin}
                  style={styles.socialButton}
                  contentStyle={styles.socialButtonContent}
                  icon="google"
                >
                  Continuer avec Google
                </Button>
                
                <Button
                  mode="outlined"
                  onPress={handleFacebookLogin}
                  style={styles.socialButton}
                  contentStyle={styles.socialButtonContent}
                  icon="facebook"
                >
                  Continuer avec Facebook
                </Button>
              </View>

              <View style={styles.divider}>
                <Text style={styles.dividerText}>ou</Text>
              </View>

              {/* Connexion par email/mot de passe */}
              <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
                left={<TextInput.Icon icon="email" />}
              />

              <TextInput
                label="Mot de passe"
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                secureTextEntry={!showPassword}
                style={styles.input}
                left={<TextInput.Icon icon="lock" />}
                right={
                  <TextInput.Icon
                    icon={showPassword ? "eye-off" : "eye"}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
              />

              <Button
                mode="contained"
                onPress={handleLogin}
                loading={loading}
                disabled={loading}
                style={styles.loginButton}
                contentStyle={styles.loginButtonContent}
              >
                Se connecter
              </Button>
            </Card.Content>
          </Card>
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
    paddingVertical: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  headerContent: {
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  formContainer: {
    padding: 20,
    marginTop: -30,
  },
  formCard: {
    elevation: 8,
    borderRadius: 20,
  },
  formContent: {
    padding: 30,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 24,
    textAlign: 'center',
  },
  socialButtons: {
    marginBottom: 20,
  },
  socialButton: {
    marginBottom: 12,
    borderRadius: 8,
    borderColor: '#E5E7EB',
  },
  socialButtonContent: {
    paddingVertical: 8,
  },
  divider: {
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerText: {
    fontSize: 14,
    color: '#6B7280',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  loginButton: {
    borderRadius: 8,
    backgroundColor: '#22C55E',
    marginTop: 8,
  },
  loginButtonContent: {
    paddingVertical: 12,
  },
});

export default LoginScreen;