import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Linking,
  SafeAreaView,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { Card, Button, Chip } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { API_CONFIG, FALLBACK_IMAGES } from '../constants/api';

interface LocationResult {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
  osm_type: string;
  class: string;
  image?: string;
}

const SearchScreen: React.FC = () => {
  console.log('🚀 SearchScreen component loaded');
  
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<LocationResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Trigger search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim()) {
      searchLocation(debouncedQuery);
    } else {
      setResults([]);
    }
  }, [debouncedQuery]);

  const fetchLocationImage = async (query: string, type: string): Promise<string> => {
    try {
      console.log('🖼️ Fetching image for:', query);
      const response = await fetch(
        `${API_CONFIG.UNSPLASH_BASE_URL}/search/photos?query=${encodeURIComponent(query)}&client_id=${API_CONFIG.UNSPLASH_API_KEY}&per_page=1&orientation=landscape`
      );
      
      if (!response.ok) {
        throw new Error(`Unsplash API error: ${response.status}`);
      }
      
      const data = await response.json();
      const imageUrl = data.results?.[0]?.urls?.regular;
      
      if (imageUrl) {
        console.log('✅ Image found:', imageUrl);
        return imageUrl;
      } else {
        console.log('⚠️ No image found, using fallback');
        return getFallbackImage(type);
      }
    } catch (error) {
      console.error('❌ Image fetch error:', error);
      return getFallbackImage(type);
    }
  };

  const getFallbackImage = (type: string): string => {
    switch (type) {
      case 'city':
        return FALLBACK_IMAGES.CITY;
      case 'landmark':
        return FALLBACK_IMAGES.LANDMARK;
      case 'country':
        return FALLBACK_IMAGES.COUNTRY;
      default:
        return FALLBACK_IMAGES.DEFAULT;
    }
  };

  const searchLocation = async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    console.log('🔍 Searching for:', query);
    console.log('🔗 Proxy URL:', API_CONFIG.NOMINATIM_PROXY_URL);
    console.log('🔗 Direct URL:', API_CONFIG.NOMINATIM_BASE_URL);
    setIsLoading(true);

          try {
        // Try proxy first (now that auth is fixed)
        console.log('🔗 Trying proxy:', API_CONFIG.NOMINATIM_PROXY_URL);
        const proxyUrl = `${API_CONFIG.NOMINATIM_PROXY_URL}?query=${encodeURIComponent(query)}&limit=5`;
        console.log('🔗 Full proxy URL:', proxyUrl);
        
        let response = await fetch(proxyUrl);
        console.log('📡 Proxy response status:', response.status);
        
        if (!response.ok) {
          // Fallback to direct Nominatim
          console.log('⚠️ Proxy failed, trying direct Nominatim...');
          const directUrl = `${API_CONFIG.NOMINATIM_BASE_URL}/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1`;
          console.log('🔗 Full direct URL:', directUrl);
          response = await fetch(directUrl);
          console.log('📡 Direct response status:', response.status);
        }

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const result = await response.json();
      console.log('📡 API Response:', JSON.stringify(result, null, 2));

      // Handle both proxy and direct response formats
      let locations: any[] = [];
      if (result.data && Array.isArray(result.data)) {
        // Proxy response format
        locations = result.data;
        console.log('✅ Using proxy response format');
      } else if (Array.isArray(result)) {
        // Direct Nominatim response format
        locations = result;
        console.log('✅ Using direct response format');
      } else {
        console.log('⚠️ Unexpected response format');
        locations = [];
      }

      console.log('✅ Found', locations.length, 'locations');

      // Enrich with images
      const enrichedLocations = await Promise.all(
        locations.map(async (location) => {
          const image = await fetchLocationImage(
            location.display_name.split(',')[0],
            location.class || 'default'
          );
          return {
            ...location,
            image,
          };
        })
      );

      setResults(enrichedLocations);
      console.log('🎉 Search completed successfully');

    } catch (error) {
      console.error('❌ Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    console.log('🔍 handleSearch called with:', searchQuery);
    if (searchQuery.trim()) {
      searchLocation(searchQuery);
    } else {
      console.log('⚠️ Search query is empty');
    }
  };

  const handleSearchChange = (text: string) => {
    console.log('📝 Search text changed to:', text);
    setSearchQuery(text);
  };

  const openInMaps = (lat: string, lon: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
    Linking.openURL(url);
  };

  const openInOpenStreetMap = (lat: string, lon: string) => {
    const url = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}&zoom=15`;
    Linking.openURL(url);
  };

  const getLocationIcon = (type: string): string => {
    switch (type) {
      case 'city':
        return 'business-outline';
      case 'landmark':
        return 'location-outline';
      case 'country':
        return 'flag-outline';
      case 'state':
        return 'map-outline';
      default:
        return 'location-outline';
    }
  };

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    if (searchQuery.trim()) {
      searchLocation(searchQuery).finally(() => setIsRefreshing(false));
    } else {
      setIsRefreshing(false);
    }
  }, [searchQuery]);

  const renderLocationCard = ({ item }: { item: LocationResult }) => (
    <Card style={styles.locationCard} mode="outlined">
      <Card.Cover source={{ uri: item.image }} style={styles.locationImage} />
      <Card.Content style={styles.cardContent}>
        <View style={styles.locationHeader}>
          <Ionicons 
            name={getLocationIcon(item.class) as any} 
            size={20} 
            color="#5A67D8" 
          />
          <Text style={styles.locationName} numberOfLines={2}>
            {item.display_name}
          </Text>
        </View>
        
        <View style={styles.locationDetails}>
          <Chip 
            mode="outlined" 
            textStyle={styles.chipText}
            style={styles.chip}
          >
            {item.class} • {item.osm_type}
          </Chip>
          <Text style={styles.coordinates}>
            📍 {parseFloat(item.lat).toFixed(4)}, {parseFloat(item.lon).toFixed(4)}
          </Text>
        </View>

        <View style={styles.actionButtons}>
          <Button
            mode="contained"
            onPress={() => openInMaps(item.lat, item.lon)}
            style={styles.mapButton}
            labelStyle={styles.buttonText}
          >
            <Ionicons name="map-outline" size={16} color="white" />
            {' '}Google Maps
          </Button>
          
          <Button
            mode="outlined"
            onPress={() => openInOpenStreetMap(item.lat, item.lon)}
            style={styles.mapButton}
            labelStyle={styles.buttonText}
          >
            <Ionicons name="globe-outline" size={16} color="#5A67D8" />
            {' '}OpenStreetMap
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  const renderQuickTestButton = (query: string) => (
    <TouchableOpacity
      style={styles.quickTestButton}
      onPress={() => {
        setSearchQuery(query);
        searchLocation(query);
      }}
    >
      <Text style={styles.quickTestText}>{query}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.subtitle}>Find places around the world</Text>
      </View>

      

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search-outline" size={20} color="#6B7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for a location..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={handleSearchChange}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            autoCapitalize="words"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={20} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearch}
          disabled={!searchQuery.trim() || isLoading}
        >
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>



      {/* Quick Test Buttons */}
      {!searchQuery && results.length === 0 && !isLoading && (
        <View style={styles.quickTestContainer}>
          <Text style={styles.quickTestTitle}>Try searching for:</Text>
          <View style={styles.quickTestButtons}>
            {renderQuickTestButton('Monaco')}
            {renderQuickTestButton('Dubai')}
            {renderQuickTestButton('Singapore')}
            {renderQuickTestButton('Barcelona')}
          </View>
        </View>
      )}

      {/* Loading State */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#5A67D8" />
          <Text style={styles.loadingText}>Searching for locations...</Text>
        </View>
      )}

      {/* Results */}
      <FlatList
        data={results}
        keyExtractor={(item, index) => `${item.place_id}-${index}`}
        renderItem={renderLocationCard}
        contentContainerStyle={styles.resultsContainer}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={['#5A67D8']}
            tintColor="#5A67D8"
          />
        }
        ListEmptyComponent={
          !isLoading && searchQuery ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={48} color="#9CA3AF" />
              <Text style={styles.emptyTitle}>No locations found</Text>
              <Text style={styles.emptySubtitle}>
                Try searching for a different location or check your spelling
              </Text>
            </View>
          ) : null
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: '#1F2937',
  },
  clearButton: {
    padding: 4,
  },
  searchButton: {
    backgroundColor: '#5A67D8',
    borderRadius: 12,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
  },
  searchButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  quickTestContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  quickTestTitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  quickTestButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickTestButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  quickTestText: {
    fontSize: 14,
    color: '#5A67D8',
    fontWeight: '500',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  resultsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  locationCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  locationImage: {
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardContent: {
    padding: 16,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 8,
  },
  locationName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    lineHeight: 22,
  },
  locationDetails: {
    marginBottom: 16,
  },
  chip: {
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  chipText: {
    fontSize: 12,
    color: '#5A67D8',
  },
  coordinates: {
    fontSize: 14,
    color: '#6B7280',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  mapButton: {
    flex: 1,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});

export default SearchScreen; 