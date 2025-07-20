import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');

const LoadingScreen = ({ navigation }: any) => {
  const [progress, setProgress] = useState(0);
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);
  const rotateAnim = new Animated.Value(0);

  useEffect(() => {
    // Animation d'entrée
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    // Animation de rotation continue
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();

    // Timer de 30 secondes avec progression
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Redirection vers le Dashboard
          setTimeout(() => {
            navigation.replace('MainTabs');
          }, 500);
          return 100;
        }
        return prev + (100 / 30); // 30 secondes = 100%
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const features = [
    'Analyse IA des sols',
    'Investissement agricole',
    'Marketplace locale',
    'Formation continue'
  ];

  return (
    <LinearGradient
      colors={['#22C55E', '#16A34A', '#15803D']}
      style={styles.container}
    >
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        {/* Logo animé */}
        <Animated.View style={[styles.logoContainer, { transform: [{ rotate: spin }] }]}>
        <Icon name="agriculture" size={80} color="#FFFFFF" />
        </Animated.View>

        <Text style={styles.title}>TerraNobis</Text>
        <Text style={styles.subtitle}>L'avenir de l'agriculture</Text>

        {/* Barre de progression */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{Math.round(progress)}%</Text>
        </View>

        {/* Features animées */}
        <View style={styles.featuresContainer}>
          {features.map((feature, index) => (
            <Animated.Text
              key={index}
              style={[
                styles.featureText,
                {
                  opacity: progress > (index * 25) ? 1 : 0.3,
                  transform: [{ scale: progress > (index * 25) ? 1 : 0.8 }]
                }
              ]}
            >
              ✓ {feature}
            </Animated.Text>
          ))}
      </View>

        {/* Message de chargement */}
        <Text style={styles.loadingText}>
          Préparation de votre expérience agricole...
        </Text>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 40,
  },
  progressContainer: {
    width: width - 80,
    marginBottom: 40,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },
  progressText: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
  featuresContainer: {
    marginBottom: 40,
  },
  featureText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 14,
    opacity: 0.8,
    textAlign: 'center',
  },
});

export default LoadingScreen;