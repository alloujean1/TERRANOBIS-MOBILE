import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Text, Card, Button, Searchbar } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../contexts/AuthContext';

const { width } = Dimensions.get('window');

const DashboardScreen = ({ navigation }: any) => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = React.useState('');

  const projects = [
    { id: '1', title: 'Maraîchage Bio', tasks: 8, color: '#22C55E', icon: 'agriculture' },
    { id: '2', title: 'Irrigation IA', tasks: 12, color: '#0EA5E9', icon: 'water' },
    { id: '3', title: 'Verger Collectif', tasks: 5, color: '#8B5CF6', icon: 'park' },
  ];

  const newTasks = [
    { id: '1', title: 'Analyse du sol', project: 'Maraîchage Bio', status: 'new', icon: 'search', color: '#22C55E' },
    { id: '2', title: 'Installation capteurs', project: 'Irrigation IA', status: 'new', icon: 'sensors', color: '#0EA5E9' },
    { id: '3', title: 'Plantation arbres', project: 'Verger Collectif', status: 'new', icon: 'park', color: '#8B5CF6' },
  ];

  const recentActivity = [
    { icon: 'trending-up', text: 'Nouvel investissement de 5,000 FCFA', time: '2h', color: '#22C55E' },
    { icon: 'update', text: 'Mise à jour de projet demandée', time: '4h', color: '#F59E0B' },
    { icon: 'shopping-cart', text: 'Vente de 50kg de mil', time: '1j', color: '#0EA5E9' },
    { icon: 'verified', text: 'Certification bio approuvée', time: '2j', color: '#22C55E' },
  ];

  const formatDate = () => {
    const today = new Date();
    return today.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Text style={styles.date}>{formatDate()}</Text>
            <Icon name="notifications" size={24} color="#6B7280" />
          </View>
          <Text style={styles.greeting}>Bon retour, {user?.name || 'Utilisateur'} !</Text>
          
          <Searchbar
            placeholder="Rechercher..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
            iconColor="#22C55E"
          />
        </View>

        {/* My Projects Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mes Projets</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.projectsScroll}>
            {projects.map((project) => (
              <Card key={project.id} style={[styles.projectCard, { backgroundColor: project.color }]}>
                <Card.Content style={styles.projectContent}>
                  <Icon name={project.icon} size={24} color="#FFFFFF" style={styles.projectIcon} />
                  <Text style={styles.projectTitle}>{project.title}</Text>
                  <Text style={styles.projectTasks}>{project.tasks} tâches</Text>
                </Card.Content>
              </Card>
            ))}
          </ScrollView>
        </View>

        {/* New Tasks Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nouvelles Tâches</Text>
            <Text style={styles.viewAll}>Voir tout</Text>
          </View>
          {newTasks.map((task) => (
            <Card key={task.id} style={styles.taskCard}>
              <Card.Content style={styles.taskContent}>
                <View style={[styles.taskIcon, { backgroundColor: `${task.color}20` }]}>
                  <Icon name={task.icon} size={20} color={task.color} />
                </View>
                <View style={styles.taskText}>
                  <Text style={styles.taskTitle}>{task.title}</Text>
                  <Text style={styles.taskProject}>{task.project}</Text>
                </View>
                <View style={styles.taskStatus}>
                  <Text style={styles.newTag}>Nouveau</Text>
                </View>
              </Card.Content>
            </Card>
          ))}
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activité récente</Text>
          <Card style={styles.activityCard}>
            <Card.Content>
              {recentActivity.map((activity, index) => (
                <View key={index} style={styles.activityItem}>
                  <View style={[styles.activityIcon, { backgroundColor: `${activity.color}20` }]}>
                    <Icon name={activity.icon} size={20} color={activity.color} />
                  </View>
                  <View style={styles.activityText}>
                    <Text style={styles.activityDescription}>{activity.text}</Text>
                    <Text style={styles.activityTime}>Il y a {activity.time}</Text>
                  </View>
                </View>
              ))}
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
    padding: 20,
    paddingTop: 10,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: '#6B7280',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  searchBar: {
    backgroundColor: '#FFFFFF',
    elevation: 2,
    borderRadius: 12,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  viewAll: {
    fontSize: 14,
    color: '#22C55E',
    fontWeight: '600',
  },
  projectsScroll: {
    marginLeft: -20,
    paddingLeft: 20,
  },
  projectCard: {
    width: 160,
    marginRight: 12,
    borderRadius: 16,
  },
  projectContent: {
    padding: 16,
    alignItems: 'center',
  },
  projectIcon: {
    marginBottom: 8,
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  projectTasks: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  taskCard: {
    marginBottom: 12,
    borderRadius: 12,
    elevation: 2,
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  taskIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  taskText: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  taskProject: {
    fontSize: 14,
    color: '#6B7280',
  },
  taskStatus: {
    alignItems: 'flex-end',
  },
  newTag: {
    backgroundColor: '#22C55E',
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activityCard: {
    borderRadius: 12,
    elevation: 2,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityText: {
    flex: 1,
  },
  activityDescription: {
    fontSize: 14,
    color: '#1F2937',
  },
  activityTime: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
});

export default DashboardScreen;