import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity, Image } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.container}>
        <LinearGradient
        colors={['#0EA5E9', '#22C55E', '#16A34A']}
        style={styles.gradient}
      >
        {/* Abstract shapes overlay */}
        <View style={styles.shape1} />
        <View style={styles.shape2} />
        <View style={styles.shape3} />
        
        <View style={styles.content}>
          {/* Logo stylisé */}
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Image source={require('../../assets/icon.jpeg')} style={{ width: 80, height: 80, borderRadius: 40 }} />
            </View>
        </View>

          {/* App Name */}
          <Text style={styles.appName}>
            <Text style={styles.appNameMain}>Terra</Text>
            <Text style={styles.appNameSub}>Nobis</Text>
          </Text>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            L'avenir de l'agriculture alimenté par l'IA
          </Text>

          {/* Get Started Button */}
          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.getStartedText}>Commencer</Text>
          </TouchableOpacity>

          {/* Social Login Text */}
          <Text style={styles.socialText}>
            Connectez-vous avec votre compte social
          </Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  shape1: {
    position: 'absolute',
    top: height * 0.1,
    left: width * 0.1,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  shape2: {
    position: 'absolute',
    top: height * 0.3,
    right: width * 0.05,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  shape3: {
    position: 'absolute',
    bottom: height * 0.2,
    left: width * 0.2,
    width: 120,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  content: {
    alignItems: 'center',
    zIndex: 1,
  },
  logoContainer: {
    marginBottom: 30,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  appName: {
    marginBottom: 16,
  },
  appNameMain: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  appNameSub: {
    fontSize: 28,
    fontWeight: 'normal',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 60,
    opacity: 0.9,
    lineHeight: 24,
  },
  getStartedButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(14, 165, 233, 0.3)',
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  getStartedText: {
    color: '#1F2937',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  socialText: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.7,
    textAlign: 'center',
  },
});

export default WelcomeScreen;