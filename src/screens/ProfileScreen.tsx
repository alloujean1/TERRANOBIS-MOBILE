import React from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Button, Avatar, Divider } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../contexts/AuthContext';

const ProfileScreen = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Déconnecter', onPress: logout, style: 'destructive' }
      ]
    );
  };

  const handleEditProfile = () => {
    Alert.alert('Modifier le profil', 'Fonctionnalité à venir');
  };

  const handleSettings = () => {
    Alert.alert('Paramètres', 'Fonctionnalité à venir');
  };

  const handleHelp = () => {
    Alert.alert('Aide', 'Centre d\'aide et support');
  };

  const handleAbout = () => {
    Alert.alert('À propos', 'TerraNobis v1.0.0\nApplication d\'agriculture intelligente');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header avec gradient */}
        <LinearGradient
          colors={['#3B82F6', '#1D4ED8']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <Avatar.Image
              size={80}
              source={{ uri: 'https://via.placeholder.com/80' }}
              style={styles.avatar}
            />
            <Text style={styles.userName}>Jean Dupont</Text>
            <Text style={styles.userRole}>Agriculteur Expert</Text>
            <Text style={styles.userLocation}>Thiès, Sénégal</Text>
          </View>
        </LinearGradient>

        {/* Statistiques */}
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Icon name="analytics" size={32} color="#3B82F6" />
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Analyses</Text>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Icon name="trending-up" size={32} color="#22C55E" />
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>Investissements</Text>
            </Card.Content>
          </Card>

          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Icon name="star" size={32} color="#F59E0B" />
              <Text style={styles.statNumber}>4.8</Text>
              <Text style={styles.statLabel}>Note</Text>
            </Card.Content>
          </Card>
        </View>

        {/* Actions principales */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actions rapides</Text>
          
          <Button
            mode="contained"
            onPress={handleEditProfile}
            style={styles.actionButton}
            icon="edit"
            contentStyle={styles.actionButtonContent}
          >
            Modifier le profil
          </Button>

          <Button
            mode="outlined"
            onPress={handleSettings}
            style={styles.actionButton}
            icon="settings"
            contentStyle={styles.actionButtonContent}
          >
            Paramètres
          </Button>
        </View>

        {/* Informations personnelles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations personnelles</Text>
          
          <Card style={styles.infoCard}>
            <Card.Content>
              <View style={styles.infoRow}>
                <Icon name="email" size={20} color="#6B7280" />
                <Text style={styles.infoLabel}>Email:</Text>
                <Text style={styles.infoValue}>jean.dupont@email.com</Text>
              </View>
              
              <Divider style={styles.divider} />
              
              <View style={styles.infoRow}>
                <Icon name="phone" size={20} color="#6B7280" />
                <Text style={styles.infoLabel}>Téléphone:</Text>
                <Text style={styles.infoValue}>+221 77 123 45 67</Text>
              </View>
              
              <Divider style={styles.divider} />
              
              <View style={styles.infoRow}>
                <Icon name="location-on" size={20} color="#6B7280" />
                <Text style={styles.infoLabel}>Localisation:</Text>
                <Text style={styles.infoValue}>Thiès, Sénégal</Text>
              </View>
              
              <Divider style={styles.divider} />
              
              <View style={styles.infoRow}>
                <Icon name="agriculture" size={20} color="#6B7280" />
                <Text style={styles.infoLabel}>Type d'agriculture:</Text>
                <Text style={styles.infoValue}>Céréales & Légumes</Text>
              </View>
              
              <Divider style={styles.divider} />
              
              <View style={styles.infoRow}>
                <Icon name="crop-square" size={20} color="#6B7280" />
                <Text style={styles.infoLabel}>Superficie totale:</Text>
                <Text style={styles.infoValue}>15 hectares</Text>
              </View>
            </Card.Content>
          </Card>
        </View>

        {/* Activité récente */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Activité récente</Text>
          
          <Card style={styles.activityCard}>
            <Card.Content>
              <View style={styles.activityItem}>
                <Icon name="psychology" size={24} color="#3B82F6" />
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>Analyse de sol terminée</Text>
                  <Text style={styles.activitySubtitle}>Parcelle A - Sols ferrugineux</Text>
                  <Text style={styles.activityTime}>Il y a 2 heures</Text>
                </View>
              </View>
              
              <Divider style={styles.divider} />
              
              <View style={styles.activityItem}>
                <Icon name="trending-up" size={24} color="#22C55E" />
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>Nouvel investissement</Text>
                  <Text style={styles.activitySubtitle}>Projet Maïs - 5 hectares</Text>
                  <Text style={styles.activityTime}>Il y a 1 jour</Text>
                </View>
              </View>
              
              <Divider style={styles.divider} />
              
              <View style={styles.activityItem}>
                <Icon name="download" size={24} color="#F59E0B" />
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>Rapport téléchargé</Text>
                  <Text style={styles.activitySubtitle}>Analyse complète - Parcelle B</Text>
                  <Text style={styles.activityTime}>Il y a 3 jours</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        </View>

        {/* Support et aide */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          
          <Button
            mode="text"
            onPress={handleHelp}
            style={styles.supportButton}
            icon="help"
            contentStyle={styles.supportButtonContent}
          >
            Centre d'aide
          </Button>

          <Button
            mode="text"
            onPress={handleAbout}
            style={styles.supportButton}
            icon="info"
            contentStyle={styles.supportButtonContent}
          >
            À propos
          </Button>
        </View>

        {/* Déconnexion */}
        <View style={styles.section}>
          <Button
            mode="contained"
            onPress={handleLogout}
            style={styles.logoutButton}
            icon="logout"
            contentStyle={styles.logoutButtonContent}
          >
            Se déconnecter
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
  headerContent: {
    alignItems: 'center',
  },
  avatar: {
    marginBottom: 16,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 4,
  },
  userLocation: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    elevation: 2,
  },
  statContent: {
    alignItems: 'center',
    padding: 16,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  actionButton: {
    marginBottom: 12,
    borderRadius: 12,
  },
  actionButtonContent: {
    height: 48,
  },
  infoCard: {
    elevation: 2,
    borderRadius: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 12,
    marginRight: 8,
    minWidth: 100,
  },
  infoValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '500',
    flex: 1,
  },
  divider: {
    marginVertical: 4,
  },
  activityCard: {
    elevation: 2,
    borderRadius: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  activityContent: {
    marginLeft: 16,
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  activitySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  supportButton: {
    marginBottom: 8,
  },
  supportButtonContent: {
    height: 48,
    justifyContent: 'flex-start',
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    borderRadius: 12,
  },
  logoutButtonContent: {
    height: 48,
  },
});

export default ProfileScreen; 