import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<void>;
  loading: boolean;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  location?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('terranobis_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    
    // Mock authentication
    const mockUser: User = {
      id: '1',
      name: email === 'admin@terranobis.com' ? 'Admin TerraNobis' : 'Jean David',
      email,
      role: email === 'admin@terranobis.com' ? 'admin' : 'farmer',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1',
      location: 'Dakar, Sénégal',
      bio: 'Passionné par l\'agriculture durable et les savoirs ancestraux',
      verified: true,
      createdAt: new Date().toISOString()
    };

    await AsyncStorage.setItem('terranobis_user', JSON.stringify(mockUser));
    setUser(mockUser);
    setLoading(false);
  };

  const register = async (userData: RegisterData) => {
    setLoading(true);
    
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      role: userData.role,
      location: userData.location || 'Non spécifié',
      verified: false,
      createdAt: new Date().toISOString()
    };

    await AsyncStorage.setItem('terranobis_user', JSON.stringify(newUser));
    setUser(newUser);
    setLoading(false);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('terranobis_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};