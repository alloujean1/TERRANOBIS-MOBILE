import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAuth } from '../contexts/AuthContext';

// Screens
import DashboardScreen from '../screens/DashboardScreen';
import SoilAnalysisScreen from '../screens/SoilAnalysisScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AudioChatScreen from '../screens/AudioChatScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const getTabBarIcon = (routeName: string, focused: boolean, color: string, size: number) => {
  let iconName = '';

  switch (routeName) {
    case 'Dashboard':
      iconName = 'dashboard';
      break;
    case 'Soil':
      iconName = 'search';
      break;
    case 'AudioChat':
      iconName = 'mic';
      break;
    case 'Profile':
      iconName = 'person';
      break;
    default:
      iconName = 'help';
  }

  return <Icon name={iconName} size={size} color={color} />;
};

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => getTabBarIcon(route.name, focused, color, size),
        tabBarActiveTintColor: '#22C55E',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ tabBarLabel: 'Accueil' }} />
      <Tab.Screen name="Soil" component={SoilAnalysisScreen} options={{ tabBarLabel: 'Diagnostic' }} />
      <Tab.Screen name="AudioChat" component={AudioChatScreen} options={{ tabBarLabel: 'IA Audio' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Profil' }} />
    </Tab.Navigator>
  );
};

const MainNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
    </Stack.Navigator>
  );
};

export default MainNavigator;