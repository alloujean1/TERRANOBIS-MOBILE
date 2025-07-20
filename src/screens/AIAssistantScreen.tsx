import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AIAssistantScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assistant IA</Text>
      {/* Ajoute ici le contenu de la page assistant IA */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default AIAssistantScreen; 