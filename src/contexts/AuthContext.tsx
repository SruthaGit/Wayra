import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserFromStorage();
  }, []);

  const loadUserFromStorage = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error loading user from storage:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveUserToStorage = async (userData: User | null) => {
    try {
      if (userData) {
        await AsyncStorage.setItem('user', JSON.stringify(userData));
      } else {
        await AsyncStorage.removeItem('user');
      }
    } catch (error) {
      console.error('Error saving user to storage:', error);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // TODO: Implement actual API call
      // For now, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser: User = {
        id: '1',
        username: 'traveler123',
        email,
        firstName: 'John',
        lastName: 'Doe',
        avatar: 'https://via.placeholder.com/150',
        bio: 'Passionate traveler exploring the world one destination at a time.',
        joinDate: new Date().toISOString(),
        isPrivate: false,
        preferences: {
          travelStyle: ['adventurous', 'culture', 'foodie'],
          preferredRegions: ['Europe', 'Asia', 'North America'],
          budget: 'moderate',
          accessibility: false,
          notifications: {
            newFollowers: true,
            friendActivity: true,
            locationUpdates: true,
            tripReminders: true,
            weeklyDigest: true,
            marketing: false,
          },
          privacy: {
            profileVisibility: 'public',
            locationVisibility: 'friends',
            reviewVisibility: 'public',
            allowFriendRequests: true,
            allowLocationSharing: true,
            allowAnalytics: true,
          },
          language: 'en',
          currency: 'USD',
          units: 'metric',
        },
        stats: {
          totalPlaces: 25,
          totalReviews: 18,
          totalCheckins: 42,
          averageRating: 4.2,
          totalDistance: 15000,
          countriesVisited: 8,
          citiesVisited: 15,
          streakDays: 5,
          longestTrip: 14,
        },
        badges: [],
        visitedPlaces: [],
        wishlist: [],
        friends: [],
        followers: [],
        following: [],
      };

      setUser(mockUser);
      await saveUserToStorage(mockUser);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Partial<User>) => {
    setIsLoading(true);
    try {
      // TODO: Implement actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: Date.now().toString(),
        username: userData.username || 'user' + Date.now(),
        email: userData.email || '',
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        joinDate: new Date().toISOString(),
        isPrivate: false,
        preferences: {
          travelStyle: ['adventurous'],
          preferredRegions: [],
          budget: 'moderate',
          accessibility: false,
          notifications: {
            newFollowers: true,
            friendActivity: true,
            locationUpdates: true,
            tripReminders: true,
            weeklyDigest: true,
            marketing: false,
          },
          privacy: {
            profileVisibility: 'public',
            locationVisibility: 'friends',
            reviewVisibility: 'public',
            allowFriendRequests: true,
            allowLocationSharing: true,
            allowAnalytics: true,
          },
          language: 'en',
          currency: 'USD',
          units: 'metric',
        },
        stats: {
          totalPlaces: 0,
          totalReviews: 0,
          totalCheckins: 0,
          averageRating: 0,
          totalDistance: 0,
          countriesVisited: 0,
          citiesVisited: 0,
          streakDays: 0,
          longestTrip: 0,
        },
        badges: [],
        visitedPlaces: [],
        wishlist: [],
        friends: [],
        followers: [],
        following: [],
        ...userData,
      };

      setUser(newUser);
      await saveUserToStorage(newUser);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      setUser(null);
      await saveUserToStorage(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      await saveUserToStorage(updatedUser);
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 