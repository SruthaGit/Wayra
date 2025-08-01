import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { tripStorage, Trip } from '../services/tripStorage';
import {
  Text,
  Card,
  Button,
  useTheme,
  FAB,
  Chip,
  Avatar,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';



const TripsScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  
  const [refreshing, setRefreshing] = useState(false);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTrips();
  }, []);

  // Refresh trips when screen comes into focus (e.g., after creating a new trip)
  useFocusEffect(
    React.useCallback(() => {
      loadTrips();
    }, [])
  );

  const loadTrips = async () => {
    try {
      setIsLoading(true);
      const savedTrips = await tripStorage.getTrips();
      setTrips(savedTrips);
    } catch (error) {
      console.error('Error loading trips:', error);
      setTrips([]);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTrips();
    setRefreshing(false);
  };

                const handleCreateTrip = () => {
                navigation.navigate('CreateTrip' as never);
              };

              const handleTripCreated = () => {
                // Refresh trips list after creating a new trip
                loadTrips();
              };

  const handleTripPress = (tripId: string) => {
    navigation.navigate('TripDetail' as never, { tripId } as never);
  };

  const handleEditTrip = (tripId: string) => {
    navigation.navigate('EditTrip' as never, { tripId } as never);
  };

  const getStatusColor = (status: Trip['status']) => {
    switch (status) {
      case 'upcoming':
        return '#5A67D8';
      case 'ongoing':
        return '#ECC94B';
      case 'completed':
        return '#38B2AC';
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
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const renderTripCard = (trip: Trip) => (
    <TouchableOpacity
      key={trip.id}
      onPress={() => handleTripPress(trip.id)}
      style={styles.tripCardContainer}
    >
      <Card style={styles.tripCard}>
        <Card.Cover 
          source={{ uri: trip.image }} 
          style={styles.tripImage}
        />
        <Card.Content style={styles.tripContent}>
          <View style={styles.tripHeader}>
            <View style={styles.tripTitleContainer}>
              <Text variant="titleMedium" style={styles.tripTitle}>
                {trip.title}
              </Text>
              <Text variant="bodyMedium" style={styles.tripDestination}>
                {trip.destination}
              </Text>
            </View>
            <Chip
              mode="outlined"
              textStyle={[styles.statusChip, { color: getStatusColor(trip.status) }]}
              style={[styles.statusChip, { borderColor: getStatusColor(trip.status) }]}
            >
              {getStatusText(trip.status)}
            </Chip>
          </View>

          <View style={styles.tripDetails}>
            <View style={styles.tripInfo}>
              <Ionicons name="calendar" size={16} color="#6B7280" />
              <Text variant="bodySmall" style={styles.tripDate}>
                {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
              </Text>
            </View>
            
            <View style={styles.tripInfo}>
              <Ionicons name="people" size={16} color="#6B7280" />
              <Text variant="bodySmall" style={styles.tripParticipants}>
                {trip.participants} participants
              </Text>
            </View>

            <View style={styles.tripInfo}>
              <Ionicons name="wallet" size={16} color="#6B7280" />
              <Text variant="bodySmall" style={styles.tripBudget}>
                Budget: {trip.budget}
              </Text>
            </View>
          </View>

          <View style={styles.tripTags}>
            {trip.tags.map((tag) => (
              <Chip key={tag} style={styles.tag} textStyle={styles.tagText}>
                {tag}
              </Chip>
            ))}
          </View>

          <View style={styles.tripActions}>
            <Button
              mode="outlined"
              onPress={() => handleEditTrip(trip.id)}
              style={styles.actionButton}
              icon="pencil"
            >
              Edit
            </Button>
            <Button
              mode="contained"
              onPress={() => handleTripPress(trip.id)}
              style={styles.actionButton}
              icon="eye"
            >
              View Details
            </Button>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

                return (
                <SafeAreaView style={styles.container} edges={['top']}>
                  <View style={styles.content}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
                                  <Text variant="titleLarge" style={styles.appName}>
                        Wayra
                      </Text>
          </View>
          <Text variant="headlineMedium" style={styles.title}>
            My Trips
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Plan, organize, and track your adventures
          </Text>
        </View>

        <View style={styles.tripsContainer}>
          {isLoading ? (
            <View style={styles.loadingState}>
              <Text variant="titleMedium" style={styles.loadingText}>
                Loading trips...
              </Text>
            </View>
          ) : trips.length > 0 ? (
            trips.map(renderTripCard)
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="airplane" size={64} color="#9CA3AF" />
              <Text variant="titleMedium" style={styles.emptyTitle}>
                No trips planned yet
              </Text>
              <Text variant="bodyMedium" style={styles.emptySubtitle}>
                Start planning your next adventure by creating a new trip
              </Text>
              <Button
                mode="contained"
                onPress={handleCreateTrip}
                style={styles.createButton}
                icon="plus"
              >
                Create Your First Trip
              </Button>
            </View>
          )}
        </View>
      </ScrollView>

      <FAB
        icon="plus"
        style={[
          styles.fab,
          {
            bottom: Math.min(insets.bottom, 40) + 16,
          }
        ]}
        onPress={handleCreateTrip}
      />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 0,
  },
  header: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerTop: {
    marginBottom: 8,
  },
  appName: {
    fontWeight: 'bold',
    color: '#5A67D8',
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#1F2937',
  },
  subtitle: {
    opacity: 0.7,
    color: '#6B7280',
  },
  tripsContainer: {
    // Removed horizontal padding since it's now handled by SafeAreaView
  },
  tripCardContainer: {
    marginBottom: 16,
  },
  tripCard: {
    elevation: 4,
    borderRadius: 16,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  tripImage: {
    height: 200,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  tripContent: {
    padding: 16,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tripTitleContainer: {
    flex: 1,
  },
  tripTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#1F2937',
  },
  tripDestination: {
    opacity: 0.7,
    color: '#6B7280',
  },
  statusChip: {
    fontSize: 12,
    fontWeight: '500',
  },
  tripDetails: {
    marginBottom: 12,
  },
  tripInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  tripDate: {
    marginLeft: 8,
    color: '#6B7280',
  },
  tripParticipants: {
    marginLeft: 8,
    color: '#6B7280',
  },
  tripBudget: {
    marginLeft: 8,
    color: '#6B7280',
  },
  tripTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  tag: {
    marginRight: 8,
    marginBottom: 4,
    backgroundColor: '#F3F4F6',
  },
  tagText: {
    fontSize: 12,
    color: '#5A67D8',
  },
  tripActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  emptySubtitle: {
    textAlign: 'center',
    opacity: 0.7,
    color: '#6B7280',
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: '#5A67D8',
  },
  loadingState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    color: '#6B7280',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    backgroundColor: '#5A67D8',
  },
});

export default TripsScreen; 