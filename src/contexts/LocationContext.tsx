import React, { createContext, useContext, useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Coordinates, Location as LocationType, LocationContextType } from '../types';

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

interface LocationProviderProps {
  children: React.ReactNode;
}

export const LocationProvider: React.FC<LocationProviderProps> = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState<Coordinates | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestLocation = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setError('Location permission denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const coordinates: Coordinates = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      setCurrentLocation(coordinates);
    } catch (err) {
      setError('Failed to get location');
      console.error('Location error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getNearbyPlaces = async (radius: number, coords?: Coordinates): Promise<LocationType[]> => {
    const locationToUse = coords || currentLocation;
    if (!locationToUse) {
      throw new Error('No current location available');
    }

    try {
      // TODO: Implement actual API call to get nearby places
      // For now, return mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockPlaces: LocationType[] = [
        {
          id: '1',
          name: 'Central Park',
          type: 'park',
          category: ['natural', 'relaxation'],
          description: 'A beautiful urban park in the heart of the city.',
          address: {
            street: 'Central Park',
            city: 'New York',
            state: 'NY',
            country: 'USA',
            formatted: 'Central Park, New York, NY, USA',
          },
          coordinates: {
            latitude: locationToUse.latitude + 0.01,
            longitude: locationToUse.longitude + 0.01,
          },
          images: [
            {
              id: '1',
              url: 'https://via.placeholder.com/400x300',
              thumbnail: 'https://via.placeholder.com/150x100',
              caption: 'Central Park entrance',
              uploadedBy: '1',
              uploadedAt: new Date().toISOString(),
              isPrimary: true,
            },
          ],
          rating: 4.5,
          totalRatings: 1250,
          priceLevel: 'free',
          tags: ['park', 'nature', 'relaxation', 'family'],
          amenities: ['restrooms', 'playground', 'picnic areas', 'walking trails'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: '1',
          isVerified: true,
          isActive: true,
        },
        {
          id: '2',
          name: 'The Metropolitan Museum of Art',
          type: 'museum',
          category: ['cultural', 'historical'],
          description: 'One of the world\'s largest and most prestigious art museums.',
          address: {
            street: '1000 5th Ave',
            city: 'New York',
            state: 'NY',
            country: 'USA',
            formatted: '1000 5th Ave, New York, NY, USA',
          },
          coordinates: {
            latitude: locationToUse.latitude + 0.02,
            longitude: locationToUse.longitude + 0.02,
          },
          images: [
            {
              id: '2',
              url: 'https://via.placeholder.com/400x300',
              thumbnail: 'https://via.placeholder.com/150x100',
              caption: 'Metropolitan Museum facade',
              uploadedBy: '1',
              uploadedAt: new Date().toISOString(),
              isPrimary: true,
            },
          ],
          rating: 4.8,
          totalRatings: 890,
          priceLevel: 'moderate',
          tags: ['museum', 'art', 'culture', 'history'],
          amenities: ['gift shop', 'cafe', 'guided tours', 'wheelchair accessible'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: '1',
          isVerified: true,
          isActive: true,
        },
        {
          id: '3',
          name: 'Joe\'s Pizza',
          type: 'restaurant',
          category: ['food'],
          description: 'Authentic New York style pizza since 1975.',
          address: {
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            country: 'USA',
            formatted: '123 Main St, New York, NY, USA',
          },
          coordinates: {
            latitude: locationToUse.latitude - 0.01,
            longitude: locationToUse.longitude - 0.01,
          },
          images: [
            {
              id: '3',
              url: 'https://via.placeholder.com/400x300',
              thumbnail: 'https://via.placeholder.com/150x100',
              caption: 'Delicious pizza',
              uploadedBy: '1',
              uploadedAt: new Date().toISOString(),
              isPrimary: true,
            },
          ],
          rating: 4.2,
          totalRatings: 567,
          priceLevel: 'budget',
          tags: ['pizza', 'italian', 'casual', 'takeout'],
          amenities: ['delivery', 'takeout', 'dine-in', 'outdoor seating'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: '1',
          isVerified: true,
          isActive: true,
        },
      ];

      return mockPlaces;
    } catch (err) {
      console.error('Error fetching nearby places:', err);
      throw err;
    }
  };

  const value: LocationContextType = {
    currentLocation,
    isLoading,
    error,
    requestLocation,
    getNearbyPlaces,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}; 