// User Types
export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  bio?: string;
  dateOfBirth?: string;
  location?: string;
  joinDate: string;
  isPrivate: boolean;
  preferences: UserPreferences;
  stats: UserStats;
  badges: Badge[];
  visitedPlaces: string[]; // Location IDs
  wishlist: string[]; // Location IDs
  friends: string[]; // User IDs
  followers: string[]; // User IDs
  following: string[]; // User IDs
}

export interface UserPreferences {
  travelStyle: TravelStyle[];
  preferredRegions: string[];
  budget: BudgetLevel;
  accessibility: boolean;
  notifications: NotificationSettings;
  privacy: PrivacySettings;
  language: string;
  currency: string;
  units: 'metric' | 'imperial';
}

export interface UserStats {
  totalPlaces: number;
  totalReviews: number;
  totalCheckins: number;
  averageRating: number;
  totalDistance: number;
  countriesVisited: number;
  citiesVisited: number;
  streakDays: number;
  longestTrip: number;
}

// Location Types
export interface Location {
  id: string;
  name: string;
  type: LocationType;
  category: LocationCategory[];
  description: string;
  address: Address;
  coordinates: Coordinates;
  images: LocationImage[];
  rating: number;
  totalRatings: number;
  priceLevel: PriceLevel;
  tags: string[];
  amenities: string[];
  openingHours?: OpeningHours;
  contactInfo?: ContactInfo;
  website?: string;
  socialMedia?: SocialMedia;
  bestTimeToVisit?: string[];
  weather?: WeatherInfo;
  accessibility: AccessibilityInfo;
  createdAt: string;
  updatedAt: string;
  createdBy: string; // User ID
  isVerified: boolean;
  isActive: boolean;
}

export interface LocationImage {
  id: string;
  url: string;
  thumbnail: string;
  caption?: string;
  uploadedBy: string; // User ID
  uploadedAt: string;
  isPrimary: boolean;
}

export interface Address {
  street: string;
  city: string;
  state?: string;
  country: string;
  postalCode?: string;
  formatted: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface OpeningHours {
  monday?: DaySchedule;
  tuesday?: DaySchedule;
  wednesday?: DaySchedule;
  thursday?: DaySchedule;
  friday?: DaySchedule;
  saturday?: DaySchedule;
  sunday?: DaySchedule;
  specialHours?: SpecialHours[];
}

export interface DaySchedule {
  open: string;
  close: string;
  isClosed: boolean;
}

export interface SpecialHours {
  date: string;
  open: string;
  close: string;
  isClosed: boolean;
  reason?: string;
}

export interface ContactInfo {
  phone?: string;
  email?: string;
}

export interface SocialMedia {
  instagram?: string;
  facebook?: string;
  twitter?: string;
  youtube?: string;
}

export interface WeatherInfo {
  current: WeatherData;
  forecast: WeatherData[];
}

export interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  date: string;
}

export interface AccessibilityInfo {
  wheelchairAccessible: boolean;
  accessibleParking: boolean;
  accessibleRestrooms: boolean;
  accessibleEntrance: boolean;
  serviceAnimalsAllowed: boolean;
  hearingAssistance: boolean;
  visualAssistance: boolean;
  notes?: string;
}

// Review Types
export interface Review {
  id: string;
  locationId: string;
  userId: string;
  rating: number;
  title?: string;
  content: string;
  images?: ReviewImage[];
  tags: ReviewTag[];
  helpfulCount: number;
  helpfulUsers: string[]; // User IDs
  createdAt: string;
  updatedAt: string;
  isEdited: boolean;
  isVerified: boolean;
  isHidden: boolean;
}

export interface ReviewImage {
  id: string;
  url: string;
  thumbnail: string;
  caption?: string;
}

export interface ReviewTag {
  id: string;
  name: string;
  category: string;
}

// Check-in Types
export interface CheckIn {
  id: string;
  locationId: string;
  userId: string;
  timestamp: string;
  coordinates?: Coordinates;
  photos?: CheckInPhoto[];
  mood?: Mood;
  notes?: string;
  isPublic: boolean;
  sharedWith: string[]; // User IDs
}

export interface CheckInPhoto {
  id: string;
  url: string;
  thumbnail: string;
  caption?: string;
}

// Trip Types
export interface Trip {
  id: string;
  name: string;
  description?: string;
  userId: string;
  startDate: string;
  endDate: string;
  destinations: TripDestination[];
  itinerary: TripDay[];
  budget?: Budget;
  companions: string[]; // User IDs
  isPublic: boolean;
  status: TripStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TripDestination {
  locationId: string;
  order: number;
  duration: number; // in days
  notes?: string;
}

export interface TripDay {
  date: string;
  activities: TripActivity[];
  accommodation?: string;
  transportation?: TransportationInfo;
  notes?: string;
}

export interface TripActivity {
  id: string;
  locationId?: string;
  title: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  type: ActivityType;
  cost?: number;
  bookingInfo?: BookingInfo;
  notes?: string;
}

export interface TransportationInfo {
  type: TransportationType;
  details?: string;
  cost?: number;
  bookingInfo?: BookingInfo;
}

export interface BookingInfo {
  confirmationNumber?: string;
  provider?: string;
  contactInfo?: string;
  notes?: string;
}

export interface Budget {
  total: number;
  currency: string;
  categories: BudgetCategory[];
}

export interface BudgetCategory {
  name: string;
  amount: number;
  spent: number;
}

// Badge Types
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: BadgeCategory;
  criteria: BadgeCriteria;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
}

export interface BadgeCriteria {
  type: BadgeCriteriaType;
  value: number;
  description: string;
}

// Enums
export enum TravelStyle {
  ADVENTUROUS = 'adventurous',
  LUXURY = 'luxury',
  BUDGET = 'budget',
  FOODIE = 'foodie',
  CULTURE = 'culture',
  NATURE = 'nature',
  RELAXATION = 'relaxation',
  SOLO = 'solo',
  FAMILY = 'family',
  BUSINESS = 'business',
  ROMANTIC = 'romantic',
  BACKPACKING = 'backpacking',
}

export enum BudgetLevel {
  BUDGET = 'budget',
  MODERATE = 'moderate',
  LUXURY = 'luxury',
  ULTRA_LUXURY = 'ultra_luxury',
}

export enum LocationType {
  RESTAURANT = 'restaurant',
  HOTEL = 'hotel',
  ATTRACTION = 'attraction',
  MUSEUM = 'museum',
  PARK = 'park',
  BEACH = 'beach',
  MOUNTAIN = 'mountain',
  CITY = 'city',
  LANDMARK = 'landmark',
  SHOPPING = 'shopping',
  NIGHTLIFE = 'nightlife',
  TRANSPORT = 'transport',
  OTHER = 'other',
}

export enum LocationCategory {
  BEACH = 'beach',
  MOUNTAIN = 'mountain',
  CITY = 'city',
  HISTORICAL = 'historical',
  CULTURAL = 'cultural',
  NATURAL = 'natural',
  ADVENTURE = 'adventure',
  RELAXATION = 'relaxation',
  FOOD = 'food',
  SHOPPING = 'shopping',
  NIGHTLIFE = 'nightlife',
  FAMILY = 'family',
  ROMANTIC = 'romantic',
  BUDGET = 'budget',
  LUXURY = 'luxury',
}

export enum PriceLevel {
  FREE = 'free',
  BUDGET = 'budget',
  MODERATE = 'moderate',
  EXPENSIVE = 'expensive',
  LUXURY = 'luxury',
}

export enum ActivityType {
  VISIT = 'visit',
  EAT = 'eat',
  SLEEP = 'sleep',
  TRANSPORT = 'transport',
  ACTIVITY = 'activity',
  SHOPPING = 'shopping',
  ENTERTAINMENT = 'entertainment',
}

export enum TransportationType {
  WALK = 'walk',
  BIKE = 'bike',
  CAR = 'car',
  BUS = 'bus',
  TRAIN = 'train',
  PLANE = 'plane',
  BOAT = 'boat',
  TAXI = 'taxi',
  RIDESHARE = 'rideshare',
}

export enum TripStatus {
  PLANNING = 'planning',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum Mood {
  EXCITED = 'excited',
  HAPPY = 'happy',
  RELAXED = 'relaxed',
  NEUTRAL = 'neutral',
  DISAPPOINTED = 'disappointed',
  STRESSED = 'stressed',
}

export enum BadgeCategory {
  EXPLORER = 'explorer',
  CULTURE = 'culture',
  ADVENTURE = 'adventure',
  FOOD = 'food',
  SOCIAL = 'social',
  ACHIEVEMENT = 'achievement',
  SPECIAL = 'special',
}

export enum BadgeCriteriaType {
  PLACES_VISITED = 'places_visited',
  COUNTRIES_VISITED = 'countries_visited',
  REVIEWS_WRITTEN = 'reviews_written',
  CHECKINS = 'checkins',
  STREAK_DAYS = 'streak_days',
  FRIENDS_MADE = 'friends_made',
  TRIPS_COMPLETED = 'trips_completed',
  RATINGS_GIVEN = 'ratings_given',
}

// Settings Types
export interface NotificationSettings {
  newFollowers: boolean;
  friendActivity: boolean;
  locationUpdates: boolean;
  tripReminders: boolean;
  weeklyDigest: boolean;
  marketing: boolean;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  locationVisibility: 'public' | 'friends' | 'private';
  reviewVisibility: 'public' | 'friends' | 'private';
  allowFriendRequests: boolean;
  allowLocationSharing: boolean;
  allowAnalytics: boolean;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Navigation Types
export type RootStackParamList = {
  Onboarding: undefined;
  Auth: undefined;
  Main: undefined;
  LocationDetail: { locationId: string };
  UserProfile: { userId: string };
  TripDetail: { tripId: string };
  CreateTrip: undefined;
  EditTrip: { tripId: string };
  Search: undefined;
  Settings: undefined;
  Notifications: undefined;
  Friends: undefined;
  Badges: undefined;
  ReviewForm: { locationId: string };
  CheckInForm: { locationId: string };
  ImageGallery: { images: LocationImage[]; initialIndex: number };
};

export type MainTabParamList = {
  Home: undefined;
  Explore: undefined;
  Trips: undefined;
  Profile: undefined;
};

// Context Types
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User>) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

export interface LocationContextType {
  currentLocation: Coordinates | null;
  isLoading: boolean;
  error: string | null;
  requestLocation: () => Promise<void>;
  getNearbyPlaces: (radius: number) => Promise<Location[]>;
}

export interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (isDark: boolean) => void;
} 