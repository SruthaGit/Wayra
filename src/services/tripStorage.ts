import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Trip {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  image: string;
  participants: number;
  budget: string;
  tags: string[];
  description?: string;
  locations?: string[];
  createdAt: string;
  updatedAt: string;
}

const TRIPS_STORAGE_KEY = 'user_trips';

export const tripStorage = {
  // Save a new trip
  async saveTrip(trip: Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>): Promise<Trip> {
    try {
      const existingTrips = await this.getTrips();
      const newTrip: Trip = {
        ...trip,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const updatedTrips = [...existingTrips, newTrip];
      await AsyncStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(updatedTrips));
      
      return newTrip;
    } catch (error) {
      console.error('Error saving trip:', error);
      throw error;
    }
  },

  // Get all trips
  async getTrips(): Promise<Trip[]> {
    try {
      const tripsData = await AsyncStorage.getItem(TRIPS_STORAGE_KEY);
      return tripsData ? JSON.parse(tripsData) : [];
    } catch (error) {
      console.error('Error loading trips:', error);
      return [];
    }
  },

  // Get a specific trip by ID
  async getTripById(tripId: string): Promise<Trip | null> {
    try {
      const trips = await this.getTrips();
      return trips.find(trip => trip.id === tripId) || null;
    } catch (error) {
      console.error('Error loading trip:', error);
      return null;
    }
  },

  // Update an existing trip
  async updateTrip(tripId: string, updates: Partial<Trip>): Promise<Trip | null> {
    try {
      const trips = await this.getTrips();
      const tripIndex = trips.findIndex(trip => trip.id === tripId);
      
      if (tripIndex === -1) {
        return null;
      }

      const updatedTrip: Trip = {
        ...trips[tripIndex],
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      trips[tripIndex] = updatedTrip;
      await AsyncStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(trips));
      
      return updatedTrip;
    } catch (error) {
      console.error('Error updating trip:', error);
      throw error;
    }
  },

  // Delete a trip
  async deleteTrip(tripId: string): Promise<boolean> {
    try {
      const trips = await this.getTrips();
      const filteredTrips = trips.filter(trip => trip.id !== tripId);
      await AsyncStorage.setItem(TRIPS_STORAGE_KEY, JSON.stringify(filteredTrips));
      return true;
    } catch (error) {
      console.error('Error deleting trip:', error);
      return false;
    }
  },

  // Clear all trips (for testing/reset)
  async clearAllTrips(): Promise<void> {
    try {
      await AsyncStorage.removeItem(TRIPS_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing trips:', error);
    }
  },
}; 