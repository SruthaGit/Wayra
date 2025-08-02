import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { Text } from 'react-native';
import { MainTabParamList } from '../types';


// Import screens
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import TripsScreen from '../screens/TripsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainNavigator: React.FC = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Explore') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Trips') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          shadowOffset: { width: 0, height: 0 },
          shadowRadius: 0,
          paddingBottom: 15,
          paddingTop: 5,
          height: 70,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerShown: false,
        headerStyle: {
          backgroundColor: '#FFFFFF',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
          height: 45,
        },
        headerTitleStyle: {
          fontWeight: '700',
          paddingTop: 0,
          paddingBottom: 0,
        },
        headerTitleAlign: 'left',
        headerShadowVisible: false,
      })}
    >
      <Tab.Screen 
        name="Feed" 
        component={HomeScreen}
        options={{
          headerShown: true,
          headerTitle: 'Journi',
        }}
      />
      <Tab.Screen 
        name="Explore" 
        component={SearchScreen}
        options={{
          headerShown: true,
          headerTitle: 'Explore',
        }}
      />
      <Tab.Screen 
        name="Trips" 
        component={TripsScreen}
        options={{
          headerShown: true,
          headerTitle: 'Trips',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator; 