import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  Linking,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import {
  Text,
  Searchbar,
  Chip,
  Card,
  Button,
  useTheme,
  FAB,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import { Location as LocationType } from '../types';
import sampleLocations from '../assets/sampleLocations.json';
import placesData from '../assets/data/places.json';
import Fuse from 'fuse.js';

// Feature flag for development/testing
const USE_MOCK_DATA = true;

// Convert JSON data to LocationType format
const convertToLocationType = (jsonData: any[]): LocationType[] => {
  return jsonData.map((item, index) => ({
    id: item.id || (index + 1).toString(),
    name: item.name,
    type: item.category?.[0] || 'attraction',
    category: item.category || ['attraction'],
    description: item.description,
    address: {
      street: item.name,
      city: item.city || 'Unknown',
      state: '',
      country: '',
      formatted: `${item.name}, ${item.city || 'Unknown'}`,
    },
    coordinates: item.coordinates,
    images: [{
      id: item.id || (index + 1).toString(),
      url: item.image,
      thumbnail: item.image,
      uploadedBy: '1',
      uploadedAt: new Date().toISOString(),
      isPrimary: true,
    }],
    rating: item.rating,
    totalRatings: item.reviews,
    priceLevel: item.priceLevel || 'moderate',
    tags: item.tags || [],
    amenities: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: '1',
    isVerified: true,
    isActive: true,
  }));
};

const samplePlaces = convertToLocationType(sampleLocations);

const ExploreScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [places, setPlaces] = useState<LocationType[]>([]);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [selectedCity, setSelectedCity] = useState<any>(null);
  const [showCityResults, setShowCityResults] = useState(false);

  const categories = [
    'All', 'Restaurants', 'Hotels', 'Attractions', 'Museums', 'Parks', 'Beaches', 'Mountains'
  ];

  // Fallback coordinates (Central Park, NYC)
  const fallbackLocation = {
    latitude: 40.785091,
    longitude: -73.968285,
  };

  useEffect(() => {
    loadLocation();
  }, []);

  const loadLocation = async () => {
    try {
      setIsLoadingLocation(true);
      setErrorMsg(null);

      if (USE_MOCK_DATA) {
        // Use mock data for development/testing
        setLocation({ coords: fallbackLocation } as Location.LocationObject);
        setPlaces(samplePlaces);
        setIsLoadingLocation(false);
        return;
      }

      // Request location permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setLocation({ coords: fallbackLocation } as Location.LocationObject);
        setPlaces(samplePlaces);
        setIsLoadingLocation(false);
        return;
      }

      // Get current position
      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
        timeInterval: 5000,
        distanceInterval: 10,
      });
      
      setLocation(currentLocation);
      await loadPlaces(currentLocation.coords);
    } catch (error) {
      console.error('Error loading location:', error);
      setErrorMsg('Error retrieving location');
      setLocation({ coords: fallbackLocation } as Location.LocationObject);
      setPlaces(samplePlaces);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const loadPlaces = async (coords: { latitude: number; longitude: number }) => {
    try {
      // TODO: Implement actual API call to get nearby places
      // For now, use sample places
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      setPlaces(samplePlaces);
    } catch (error) {
      console.error('Error loading places:', error);
      setPlaces(samplePlaces);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadLocation();
    setRefreshing(false);
  };

  const handleCategoryToggle = (category: string) => {
    if (category === 'All') {
      setSelectedCategories([]);
    } else {
      setSelectedCategories(prev =>
        prev.includes(category)
          ? prev.filter(c => c !== category)
          : [...prev, category]
      );
    }
  };

  const handleLocationPress = (locationId: string) => {
    navigation.navigate('LocationDetail' as never, { locationId } as never);
  };

  const handleCheckIn = (placeName: string) => {
    Alert.alert(
      'Checked In! ✅',
      `You've successfully checked in at ${placeName}`,
      [
        { text: 'OK', style: 'default' },
        { text: 'Share', style: 'default' }
      ]
    );
  };

  const handleReview = (placeName: string) => {
    Alert.alert(
      'Write a Review',
      `Review for ${placeName}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Submit', style: 'default' }
      ]
    );
  };

  const handleOpenInMaps = (place: LocationType) => {
    const url = `https://www.google.com/maps?q=${place.coordinates.latitude},${place.coordinates.longitude}`;
    Linking.openURL(url).catch(err => {
      console.error('Error opening maps:', err);
      Alert.alert('Error', 'Could not open maps');
    });
  };

                const handleSearch = (query: string) => {
                setSearchQuery(query);

                if (query.trim()) {
                  // Search for cities with fuzzy search
                  const fuse = new Fuse(placesData.cities, {
                    keys: ['name', 'country', 'description'],
                    threshold: 0.3,
                    includeScore: true,
                  });
                  
                  const cityResults = fuse.search(query);
                  const matchingCities = cityResults.map(result => result.item);

                  if (matchingCities.length > 0) {
                    setShowCityResults(true);
                  } else {
                    setShowCityResults(false);
                    
                    // Search through sample places with fuzzy search
                    const placeFuse = new Fuse(samplePlaces, {
                      keys: ['name', 'description', 'tags'],
                      threshold: 0.4,
                      includeScore: true,
                    });
                    
                    const placeResults = placeFuse.search(query);
                    const matchingPlaces = placeResults.map(result => result.item);
                    
                    if (matchingPlaces.length > 0) {
                      setPlaces(matchingPlaces);
                    } else {
                      setPlaces(samplePlaces); // Show all places if no matches
                    }
                  }
                } else {
                  setShowCityResults(false);
                  setSelectedCity(null);
                  setPlaces(samplePlaces);
                }
              };

  const handleCitySelect = (city: any) => {
    setSelectedCity(city);
    setSearchQuery(city.name);
    setShowCityResults(false);
    
    // Convert city attractions to LocationType format
    const cityPlaces = convertToLocationType(city.attractions);
    setPlaces(cityPlaces);
  };

  const filteredPlaces = places.filter(place => {
    if (searchQuery && !place.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedCategories.length > 0 && !selectedCategories.some(cat => 
      place.category.includes(cat.toLowerCase())
    )) {
      return false;
    }
    return true;
  });

  // Show loading state while location is being fetched
  if (isLoadingLocation) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text variant="titleMedium" style={styles.loadingText}>
            Loading nearby places...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

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


        {/* Location Status */}
        {errorMsg && (
          <View style={styles.locationError}>
            <Ionicons name="warning" size={20} color={theme.colors.error} />
            <Text variant="bodySmall" style={styles.errorText}>
              {errorMsg} - Using sample data
            </Text>
          </View>
        )}

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBarWrapper}>
            <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
            <TextInput
              placeholder="Search cities, places, or activities..."
              placeholderTextColor="#888"
              onChangeText={handleSearch}
              value={searchQuery}
              style={styles.searchBar}
            />
          </View>
        </View>

        {/* City Search Results */}
        {showCityResults && (
          <View style={styles.cityResults}>
            <Text variant="titleMedium" style={styles.cityResultsTitle}>
              Cities
            </Text>
            {placesData.cities
              .filter(city =>
                city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                city.country.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((city) => (
                <TouchableOpacity
                  key={city.name}
                  style={styles.cityItem}
                  onPress={() => handleCitySelect(city)}
                >
                  <Image 
                    source={{ uri: city.image }} 
                    style={styles.cityImage}
                    resizeMode="cover"
                  />
                  <View style={styles.cityInfo}>
                    <Text variant="titleMedium" style={styles.cityName}>
                      {city.name}
                    </Text>
                    <Text variant="bodyMedium" style={styles.cityCountry}>
                      {city.country}
                    </Text>
                    <Text variant="bodySmall" style={styles.cityDescription}>
                      {city.description}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
          </View>
        )}

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category) => (
              <Chip
                key={category}
                selected={category === 'All' ? selectedCategories.length === 0 : selectedCategories.includes(category)}
                onPress={() => handleCategoryToggle(category)}
                style={styles.categoryChip}
                textStyle={styles.categoryChipText}
              >
                {category}
              </Chip>
            ))}
          </ScrollView>
        </View>

        {/* Results */}
        <View style={styles.resultsContainer}>
          <View style={styles.resultsHeader}>
            <Text variant="titleLarge" style={styles.resultsTitle}>
              {selectedCity ? `${selectedCity.name} Attractions` : `${filteredPlaces.length} places found`}
            </Text>
            <Button
              mode="text"
              onPress={() => navigation.navigate('Search' as never)}
            >
              Advanced Search
            </Button>
          </View>

          {filteredPlaces.map((place) => (
            <Card
              key={place.id}
              style={styles.placeCard}
              onPress={() => handleLocationPress(place.id)}
            >
              <Card.Cover source={{ uri: place.images[0]?.url }} style={styles.placeImage} />
              <Card.Content style={styles.placeContent}>
                <View style={styles.placeHeader}>
                  <Text variant="titleMedium" style={styles.placeName}>
                    {place.name}
                  </Text>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={16} color={theme.colors.accent} />
                    <Text variant="bodyMedium" style={styles.rating}>
                      {place.rating} ({place.totalRatings})
                    </Text>
                  </View>
                </View>
                
                <Text variant="bodySmall" style={styles.placeDescription}>
                  {place.description}
                </Text>
                
                <View style={styles.placeTags}>
                  {place.tags.slice(0, 3).map((tag) => (
                    <Chip key={tag} style={styles.tag} textStyle={styles.tagText}>
                      {tag}
                    </Chip>
                  ))}
                </View>

                <View style={styles.placeActions}>
                  <Button
                    mode="outlined"
                    onPress={() => handleCheckIn(place.name)}
                    style={styles.actionButton}
                    icon="location"
                  >
                    Check In
                  </Button>
                  <Button
                    mode="outlined"
                    onPress={() => handleReview(place.name)}
                    style={styles.actionButton}
                    icon="star"
                  >
                    Review
                  </Button>
                  <Button
                    mode="outlined"
                    onPress={() => handleOpenInMaps(place)}
                    style={styles.actionButton}
                    icon="map"
                  >
                    Maps
                  </Button>
                </View>
              </Card.Content>
            </Card>
          ))}

          {filteredPlaces.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="search" size={64} color={theme.colors.onSurfaceVariant} />
              <Text variant="titleMedium" style={styles.emptyTitle}>
                No places found
              </Text>
              <Text variant="bodyMedium" style={styles.emptySubtitle}>
                Try adjusting your search or filters
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <FAB
        icon="map"
        style={[
          styles.fab,
          {
            bottom: Math.max(insets.bottom, 12),
          }
        ]}
        onPress={() => {/* TODO: Open map view */}}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  loadingText: {
    marginTop: 16,
    textAlign: 'center',
  },

  locationError: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  errorText: {
    marginLeft: 8,
    color: '#DC2626',
    flex: 1,
  },
  searchContainer: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchBar: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    backgroundColor: 'transparent',
  },
  cityResults: {
    marginBottom: 16,
  },
  cityResultsTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1F2937',
  },
  cityItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  cityImage: {
    width: 80,
    height: 80,
  },
  cityInfo: {
    flex: 1,
    padding: 12,
  },
  cityName: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#1F2937',
  },
  cityCountry: {
    color: '#6B7280',
    marginBottom: 4,
  },
  cityDescription: {
    color: '#6B7280',
    fontSize: 12,
  },
  categoriesContainer: {
    paddingBottom: 16,
  },
  categoryChip: {
    marginRight: 8,
  },
  categoryChipText: {
    fontSize: 14,
  },
  resultsContainer: {
    // Removed horizontal padding since it's now handled by SafeAreaView
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultsTitle: {
    fontWeight: 'bold',
  },
  placeCard: {
    marginBottom: 16,
    elevation: 2,
  },
  placeImage: {
    height: 200,
  },
  placeContent: {
    paddingTop: 16,
  },
  placeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  placeName: {
    fontWeight: 'bold',
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 4,
  },
  placeDescription: {
    marginBottom: 12,
    opacity: 0.7,
  },
  placeTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  tag: {
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
  },
  placeActions: {
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
  },
  emptySubtitle: {
    textAlign: 'center',
    opacity: 0.7,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
  },
});

export default ExploreScreen; 