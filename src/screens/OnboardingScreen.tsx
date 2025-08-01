import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {
  Text,
  Button,
  useTheme,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const OnboardingScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  const handleGetStarted = () => {
    navigation.navigate('Auth' as never);
  };

  return (
    <LinearGradient
      colors={[theme.colors.primary, theme.colors.secondary]}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* App Icon */}
        <View style={styles.iconContainer}>
          <Ionicons name="compass" size={120} color="white" />
        </View>

        {/* Welcome Text */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>Welcome to Wayra</Text>
          <Text style={styles.subtitle}>
            Your journey starts here. Discover, share, and plan unforgettable travel experiences.
          </Text>
        </View>

        {/* Get Started Button */}
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleGetStarted}
            style={styles.button}
            buttonColor="white"
            textColor={theme.colors.primary}
            labelStyle={styles.buttonLabel}
          >
            Get Started
          </Button>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    marginBottom: 40,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    lineHeight: 26,
    opacity: 0.9,
  },
  buttonContainer: {
    width: '100%',
  },
  button: {
    paddingVertical: 12,
    borderRadius: 12,
    elevation: 4,
  },
  buttonLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OnboardingScreen; 