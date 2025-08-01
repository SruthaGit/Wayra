import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, useTheme, Chip, Avatar } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { tripStorage, Trip } from '../services/tripStorage';

interface RouteParams {
  tripId: string;
}

const TripDetailScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { tripId } = route.params as RouteParams;
  const [trip, setTrip] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    loadTrip();
  }, [tripId]);

  const loadTrip = async () => {
    try {
      setIsLoading(true);
      const tripData = await tripStorage.getTripById(tripId);
      setTrip(tripData);
    } catch (error) {
      console.error('Error loading trip:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditTrip = () => {
    navigation.navigate('EditTrip' as never, { tripId } as never);
  };

  const handleDeleteTrip = async () => {
    if (!trip) return;
    
    try {
      await tripStorage.deleteTrip(tripId);
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting trip:', error);
    }
  };

  const getStatusColor = (status: Trip['status']) => {
    switch (status) {
      case 'upcoming':
        return '#3B82F6';
      case 'ongoing':
        return '#10B981';
      case 'completed':
        return '#6B7280';
      default:
        return '#6B7280';
    }
  };

  const getStatusText = (status: Trip['status']) => {
    switch (status) {
      case 'upcoming':
        return 'Upcoming';
      case 'ongoing':
        return 'Ongoing';
      case 'completed':
        return 'Completed';
      default:
        return 'Unknown';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text variant="titleMedium">Loading trip details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!trip) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text variant="titleMedium">Trip not found</Text>
          <Button mode="contained" onPress={() => navigation.goBack()}>
            Go Back
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Button
            icon="arrow-left"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            Back
          </Button>
          <View style={styles.headerActions}>
            <Button
              icon="pencil"
              onPress={handleEditTrip}
              style={styles.editButton}
            >
              Edit
            </Button>
            <Button
              icon="delete"
              onPress={handleDeleteTrip}
              style={styles.deleteButton}
              textColor="#EF4444"
            >
              Delete
            </Button>
          </View>
        </View>

        {/* Trip Image */}
        <View style={styles.imageContainer}>
          <Card style={styles.imageCard}>
            <Card.Cover source={{ uri: trip.image }} style={styles.tripImage} />
          </Card>
        </View>

        {/* Trip Info */}
        <View style={styles.content}>
          <View style={styles.titleSection}>
            <Text variant="headlineMedium" style={styles.title}>
              {trip.title}
            </Text>
            <Chip
              mode="outlined"
              textStyle={{ color: getStatusColor(trip.status) }}
              style={[styles.statusChip, { borderColor: getStatusColor(trip.status) }]}
            >
              {getStatusText(trip.status)}
            </Chip>
          </View>

          <Text variant="titleMedium" style={styles.destination}>
            {trip.destination}
          </Text>

          {/* Trip Details */}
          <Card style={styles.detailsCard}>
            <Card.Content>
              <View style={styles.detailRow}>
                <Ionicons name="calendar" size={20} color="#6B7280" />
                <Text variant="bodyLarge" style={styles.detailText}>
                  {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Ionicons name="people" size={20} color="#6B7280" />
                <Text variant="bodyLarge" style={styles.detailText}>
                  {trip.participants} participant{trip.participants !== 1 ? 's' : ''}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Ionicons name="wallet" size={20} color="#6B7280" />
                <Text variant="bodyLarge" style={styles.detailText}>
                  Budget: {trip.budget}
                </Text>
              </View>

              {trip.description && (
                <View style={styles.descriptionSection}>
                  <Text variant="titleMedium" style={styles.sectionTitle}>
                    Description
                  </Text>
                  <Text variant="bodyMedium" style={styles.description}>
                    {trip.description}
                  </Text>
                </View>
              )}

              {trip.tags && trip.tags.length > 0 && (
                <View style={styles.tagsSection}>
                  <Text variant="titleMedium" style={styles.sectionTitle}>
                    Tags
                  </Text>
                  <View style={styles.tags}>
                    {trip.tags.map((tag, index) => (
                      <Chip key={index} style={styles.tag}>
                        {tag}
                      </Chip>
                    ))}
                  </View>
                </View>
              )}

              {trip.locations && trip.locations.length > 0 && (
                <View style={styles.locationsSection}>
                  <Text variant="titleMedium" style={styles.sectionTitle}>
                    Locations
                  </Text>
                  {trip.locations.map((location, index) => (
                    <View key={index} style={styles.locationItem}>
                      <Ionicons name="location-outline" size={16} color="#6B7280" />
                      <Text variant="bodyMedium" style={styles.locationText}>
                        {location}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
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
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backButton: {
    marginRight: 8,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    marginRight: 8,
  },
  deleteButton: {
    borderColor: '#EF4444',
  },
  imageContainer: {
    margin: 16,
    overflow: 'hidden',
    borderRadius: 16,
  },
  imageCard: {
    borderRadius: 16,
  },
  tripImage: {
    height: 200,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontWeight: 'bold',
    color: '#1F2937',
    marginRight: 16,
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
  destination: {
    color: '#6B7280',
    marginBottom: 24,
  },
  detailsCard: {
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailText: {
    marginLeft: 12,
    color: '#374151',
  },
  descriptionSection: {
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1F2937',
  },
  description: {
    color: '#6B7280',
    lineHeight: 20,
  },
  tagsSection: {
    marginTop: 24,
    marginBottom: 16,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#E0E7FF',
  },
  locationsSection: {
    marginTop: 24,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    marginLeft: 8,
    color: '#6B7280',
  },
});

export default TripDetailScreen; 