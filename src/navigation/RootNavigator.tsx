import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from 'react-native-paper';

// Screens
import OnboardingScreen from '../screens/OnboardingScreen';
import AuthScreen from '../screens/AuthScreen';
import MainNavigator from './MainNavigator';
import LocationDetailScreen from '../screens/LocationDetailScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import HashtagPostsScreen from '../screens/HashtagPostsScreen';
import CreateTripScreen from '../screens/CreateTripScreen';
import EditTripScreen from '../screens/EditTripScreen';
import TripDetailScreen from '../screens/TripDetailScreen';
import CheckInFormScreen from '../screens/CheckInFormScreen';
import ReviewFormScreen from '../screens/ReviewFormScreen';
import SearchScreen from '../screens/SearchScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ImageGalleryScreen from '../screens/ImageGalleryScreen';
import FriendsScreen from '../screens/FriendsScreen';
import BadgesScreen from '../screens/BadgesScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createStackNavigator();

const RootNavigator: React.FC = () => {
  const { user, isLoading } = useAuth();
  const theme = useTheme();

  if (isLoading) {
    return null; // Or a loading screen
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: theme.colors.background },
      }}
    >
      {!user ? (
        // Auth screens
        <>
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Auth" component={AuthScreen} />
        </>
      ) : (
        // Main app screens
        <>
          <Stack.Screen name="Main" component={MainNavigator} />
          <Stack.Screen 
            name="LocationDetail" 
            component={LocationDetailScreen}
            options={{
              headerShown: true,
              title: 'Location Details',
              headerStyle: {
                backgroundColor: theme.colors.surface,
              },
              headerTintColor: theme.colors.onSurface,
            }}
          />
          <Stack.Screen 
            name="UserProfile" 
            component={UserProfileScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name="HashtagPosts" 
            component={HashtagPostsScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name="CreateTrip" 
            component={CreateTripScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name="EditTrip" 
            component={EditTripScreen}
            options={{
              headerShown: true,
              title: 'Edit Trip',
              headerStyle: {
                backgroundColor: theme.colors.surface,
              },
              headerTintColor: theme.colors.onSurface,
            }}
          />
          <Stack.Screen 
            name="TripDetail" 
            component={TripDetailScreen}
            options={{
              headerShown: true,
              title: 'Trip Details',
              headerStyle: {
                backgroundColor: theme.colors.surface,
              },
              headerTintColor: theme.colors.onSurface,
            }}
          />
          <Stack.Screen 
            name="CheckInForm" 
            component={CheckInFormScreen}
            options={{
              headerShown: true,
              title: 'Check In',
              headerStyle: {
                backgroundColor: theme.colors.surface,
              },
              headerTintColor: theme.colors.onSurface,
            }}
          />
          <Stack.Screen 
            name="ReviewForm" 
            component={ReviewFormScreen}
            options={{
              headerShown: true,
              title: 'Write Review',
              headerStyle: {
                backgroundColor: theme.colors.surface,
              },
              headerTintColor: theme.colors.onSurface,
            }}
          />
          <Stack.Screen 
            name="Search" 
            component={SearchScreen}
            options={{
              headerShown: true,
              title: 'Search',
              headerStyle: {
                backgroundColor: theme.colors.surface,
              },
              headerTintColor: theme.colors.onSurface,
            }}
          />
          <Stack.Screen 
            name="Notifications" 
            component={NotificationsScreen}
            options={{
              headerShown: true,
              title: 'Notifications',
              headerStyle: {
                backgroundColor: theme.colors.surface,
              },
              headerTintColor: theme.colors.onSurface,
            }}
          />
          <Stack.Screen 
            name="Settings" 
            component={SettingsScreen}
            options={{
              headerShown: true,
              title: 'Settings',
              headerStyle: {
                backgroundColor: theme.colors.surface,
              },
              headerTintColor: theme.colors.onSurface,
            }}
          />
          <Stack.Screen 
            name="ImageGallery" 
            component={ImageGalleryScreen}
            options={{
              headerShown: true,
              title: 'Gallery',
              headerStyle: {
                backgroundColor: theme.colors.surface,
              },
              headerTintColor: theme.colors.onSurface,
            }}
          />
          <Stack.Screen 
            name="Friends" 
            component={FriendsScreen}
            options={{
              headerShown: true,
              title: 'Friends',
              headerStyle: {
                backgroundColor: theme.colors.surface,
              },
              headerTintColor: theme.colors.onSurface,
            }}
          />
          <Stack.Screen 
            name="Badges" 
            component={BadgesScreen}
            options={{
              headerShown: true,
              title: 'Badges',
              headerStyle: {
                backgroundColor: theme.colors.surface,
              },
              headerTintColor: theme.colors.onSurface,
            }}
          />
          <Stack.Screen 
            name="Profile" 
            component={ProfileScreen}
            options={{
              headerShown: true,
              title: 'Profile',
              headerStyle: {
                backgroundColor: theme.colors.surface,
              },
              headerTintColor: theme.colors.onSurface,
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator; 