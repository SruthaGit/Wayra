import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useColorScheme } from 'react-native';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';

import { theme } from './src/constants/theme';
import { darkTheme } from './src/constants/darkTheme';
import RootNavigator from './src/navigation/RootNavigator';
import { AuthProvider } from './src/contexts/AuthContext';
import { LocationProvider } from './src/contexts/LocationContext';
import { ThemeProvider } from './src/contexts/ThemeContext';

export default function App() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return null; // Show loading screen while fonts are loading
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <PaperProvider theme={isDark ? darkTheme : theme}>
            <AuthProvider>
              <LocationProvider>
                <NavigationContainer>
                  <StatusBar style={isDark ? 'light' : 'dark'} />
                  <RootNavigator />
                </NavigationContainer>
              </LocationProvider>
            </AuthProvider>
          </PaperProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
} 