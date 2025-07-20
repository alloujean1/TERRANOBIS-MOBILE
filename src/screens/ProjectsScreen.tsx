import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';

const initialProjects = [
  { id: '1', title: 'Projet Maraîchage', description: 'Culture de légumes bio sur 2 hectares.' },
  { id: '2', title: 'Irrigation intelligente', description: 'Installation d’un système d’irrigation automatisé.' },
  { id: '3', title: 'Verger collaboratif', description: 'Plantation de 100 arbres fruitiers en collectif.' },
];

const ProjectsScreen = () => {
  const [projects, setProjects] = useState(initialProjects);

  const handleAddProject = () => {
    Alert.alert('Créer un projet', 'Fonctionnalité à implémenter !');
  };

  const renderItem = ({ item }) => (
    <View style={styles.projectItem}>
      <Text style={styles.projectTitle}>{item.title}</Text>
      <Text style={styles.projectDescription}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mes Projets</Text>
      <FlatList
        data={projects}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddProject}>
        <Text style={styles.addButtonText}>+ Nouveau projet</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  list: {
    paddingBottom: 20,
  },
  projectItem: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  projectDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  addButton: {
    backgroundColor: '#22C55E',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProjectsScreen; 