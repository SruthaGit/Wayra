import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';

const LocationDetailScreen: React.FC = () => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Location Details
      </Text>
      <Text variant="bodyLarge" style={styles.subtitle}>
        This screen will show detailed information about a specific location
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    opacity: 0.7,
  },
});

export default LocationDetailScreen; 