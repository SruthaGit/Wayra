import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
  TouchableOpacity,
  Text as RNText,
} from 'react-native';
import {
  Text,
  TextInput as PaperTextInput,
  Button,
  useTheme,
  IconButton,
  Chip,
  Card,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { tripStorage } from '../services/tripStorage';

interface TripForm {
  name: string;
  description: string;
  startDate: Date | null;
  endDate: Date | null;
  locations: string[];
}

const CreateTripScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  
  const [form, setForm] = useState<TripForm>({
    name: '',
    description: '',
    startDate: null,
    endDate: null,
    locations: [],
  });
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [newLocation, setNewLocation] = useState('');

  const showStartPickerHandler = () => setShowStartPicker(true);
  const hideStartPickerHandler = () => setShowStartPicker(false);
  const showEndPickerHandler = () => setShowEndPicker(true);
  const hideEndPickerHandler = () => setShowEndPicker(false);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      Alert.alert('Error', 'Please enter a trip name');
      return;
    }
    if (!form.startDate) {
      Alert.alert('Error', 'Please select a start date');
      return;
    }
    if (!form.endDate) {
      Alert.alert('Error', 'Please select an end date');
      return;
    }
    if (form.startDate >= form.endDate) {
      Alert.alert('Error', 'End date must be after start date');
      return;
    }

    try {
      // Create new trip object
      const newTrip = {
        title: form.name,
        destination: form.locations.length > 0 ? form.locations[0] : 'TBD',
        startDate: form.startDate.toISOString().split('T')[0],
        endDate: form.endDate.toISOString().split('T')[0],
        status: 'upcoming' as const,
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
        participants: 1,
        budget: '$0',
        tags: form.locations.length > 0 ? ['custom'] : [],
        description: form.description,
        locations: form.locations,
      };

      // Save trip to storage
      await tripStorage.saveTrip(newTrip);
      
      Alert.alert(
        'Success!',
        'Trip created successfully',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Error saving trip:', error);
      Alert.alert('Error', 'Failed to save trip. Please try again.');
    }
  };

  const handleStartDateConfirm = (selectedDate: Date) => {
    setForm(prev => ({ ...prev, startDate: selectedDate }));
    hideStartPickerHandler();
  };

  const handleEndDateConfirm = (selectedDate: Date) => {
    setForm(prev => ({ ...prev, endDate: selectedDate }));
    hideEndPickerHandler();
  };

  const addLocation = () => {
    if (newLocation.trim() && !form.locations.includes(newLocation.trim())) {
      setForm(prev => ({
        ...prev,
        locations: [...prev.locations, newLocation.trim()],
      }));
      setNewLocation('');
    }
  };

  const removeLocation = (location: string) => {
    setForm(prev => ({
      ...prev,
      locations: prev.locations.filter(loc => loc !== location),
    }));
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Select date';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <IconButton
            icon="arrow-left"
            size={24}
            onPress={handleBack}
            style={styles.backButton}
          />
          <Text variant="titleLarge" style={styles.headerTitle}>
            Create Trip
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Trip Name */}
          <View style={styles.inputGroup}>
            <Text variant="titleMedium" style={styles.label}>
              Trip Name *
            </Text>
            <PaperTextInput
              mode="outlined"
              placeholder="Enter trip name"
              value={form.name}
              onChangeText={(text) => setForm(prev => ({ ...prev, name: text }))}
              style={styles.input}
            />
          </View>

          {/* Description */}
          <View style={styles.inputGroup}>
            <Text variant="titleMedium" style={styles.label}>
              Description
            </Text>
            <PaperTextInput
              mode="outlined"
              placeholder="Describe your trip"
              value={form.description}
              onChangeText={(text) => setForm(prev => ({ ...prev, description: text }))}
              multiline
              numberOfLines={4}
              style={styles.input}
            />
          </View>

          {/* Dates */}
          <View style={styles.inputGroup}>
            <Text variant="titleMedium" style={styles.label}>
              Trip Dates *
            </Text>
            <View style={styles.dateContainer}>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={showStartPickerHandler}
              >
                <View style={styles.dateButtonContent}>
                  <Ionicons name="calendar" size={20} color="#5A67D8" />
                  <RNText style={styles.dateButtonText}>
                    {form.startDate ? formatDate(form.startDate) : 'Pick Start Date'}
                  </RNText>
                </View>
              </TouchableOpacity>
              <Text variant="bodyMedium" style={styles.dateSeparator}>
                to
              </Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={showEndPickerHandler}
              >
                <View style={styles.dateButtonContent}>
                  <Ionicons name="calendar" size={20} color="#5A67D8" />
                  <RNText style={styles.dateButtonText}>
                    {form.endDate ? formatDate(form.endDate) : 'Pick End Date'}
                  </RNText>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Locations */}
          <View style={styles.inputGroup}>
            <Text variant="titleMedium" style={styles.label}>
              Locations
            </Text>
            <View style={styles.locationInput}>
              <View style={styles.locationInputWrapper}>
                <Ionicons name="location-outline" size={20} color="#888" style={styles.locationIcon} />
                <TextInput
                  placeholder="Add a location"
                  placeholderTextColor="#888"
                  value={newLocation}
                  onChangeText={setNewLocation}
                  style={styles.locationTextInput}
                  onSubmitEditing={addLocation}
                />
              </View>
              <Button
                mode="contained"
                onPress={addLocation}
                disabled={!newLocation.trim()}
                style={styles.addButton}
              >
                Add
              </Button>
            </View>
            
            {form.locations.length > 0 && (
              <View style={styles.locationsList}>
                {form.locations.map((location, index) => (
                  <Chip
                    key={index}
                    onClose={() => removeLocation(location)}
                    style={styles.locationChip}
                    textStyle={styles.locationChipText}
                  >
                    {location}
                  </Chip>
                ))}
              </View>
            )}
          </View>

          {/* Trip Preview */}
          {form.name && (
            <Card style={styles.previewCard}>
              <Card.Content>
                <Text variant="titleMedium" style={styles.previewTitle}>
                  Trip Preview
                </Text>
                <Text variant="bodyLarge" style={styles.previewName}>
                  {form.name}
                </Text>
                {form.description && (
                  <Text variant="bodyMedium" style={styles.previewDescription}>
                    {form.description}
                  </Text>
                )}
                <View style={styles.previewDates}>
                  <Ionicons name="calendar" size={16} color="#6B7280" />
                  <Text variant="bodySmall" style={styles.previewDateText}>
                    {form.startDate && form.endDate
                      ? `${formatDate(form.startDate)} - ${formatDate(form.endDate)}`
                      : 'Dates not set'
                    }
                  </Text>
                </View>
                {form.locations.length > 0 && (
                  <View style={styles.previewLocations}>
                    <Ionicons name="location-outline" size={16} color="#6B7280" />
                    <Text variant="bodySmall" style={styles.previewLocationText}>
                      {form.locations.length} location{form.locations.length !== 1 ? 's' : ''}
                    </Text>
                  </View>
                )}
              </Card.Content>
            </Card>
          )}
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={handleSave}
          style={styles.saveButton}
          disabled={!form.name.trim() || !form.startDate || !form.endDate}
        >
          Create Trip
        </Button>
      </View>

      {/* Date Pickers */}
      <DateTimePickerModal
        isVisible={showStartPicker}
        mode="date"
        display="inline"
        onConfirm={handleStartDateConfirm}
        onCancel={hideStartPickerHandler}
        minimumDate={new Date(2025, 0, 1)}
        maximumDate={new Date(2030, 11, 31)}
        date={form.startDate || new Date()}
        textColor="#000000"
        buttonTextColorIOS="#5A67D8"
        themeVariant="light"
        pickerContainerStyleIOS={{
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 12,
          marginBottom: 6,
        }}
        modalPropsIOS={{
          presentationStyle: 'formSheet',
        }}
      />
      <DateTimePickerModal
        isVisible={showEndPicker}
        mode="date"
        display="inline"
        onConfirm={handleEndDateConfirm}
        onCancel={hideEndPickerHandler}
        minimumDate={form.startDate || new Date(2025, 0, 1)}
        maximumDate={new Date(2030, 11, 31)}
        date={form.endDate || new Date()}
        textColor="#000000"
        buttonTextColorIOS="#5A67D8"
        themeVariant="light"
        pickerContainerStyleIOS={{
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 12,
          marginBottom: 6,
        }}
        modalPropsIOS={{
          presentationStyle: 'formSheet',
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    margin: 0,
  },
  headerTitle: {
    fontWeight: 'bold',
    color: '#1F2937',
  },
  headerSpacer: {
    width: 48,
  },
  form: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1F2937',
  },
  input: {
    backgroundColor: 'white',
    color: '#1F2937',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dateButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#5A67D8',
    borderRadius: 8,
    padding: 12,
    backgroundColor: 'white',
    minHeight: 50,
  },
  dateButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dateButtonText: {
    color: '#5A67D8',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    includeFontPadding: false,
  },
  dateSeparator: {
    color: '#6B7280',
  },
  locationInput: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  locationInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  locationIcon: {
    marginRight: 10,
  },
  locationTextInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    backgroundColor: 'transparent',
  },
  addButton: {
    backgroundColor: '#5A67D8',
  },
  locationsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  locationChip: {
    backgroundColor: '#F3F4F6',
  },
  locationChipText: {
    color: '#5A67D8',
  },
  previewCard: {
    marginTop: 16,
    elevation: 2,
    borderRadius: 12,
  },
  previewTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1F2937',
  },
  previewName: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1F2937',
  },
  previewDescription: {
    marginBottom: 12,
    color: '#374151',
    lineHeight: 20,
  },
  previewDates: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  previewDateText: {
    marginLeft: 8,
    color: '#6B7280',
  },
  previewLocations: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewLocationText: {
    marginLeft: 8,
    color: '#6B7280',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  saveButton: {
    backgroundColor: '#5A67D8',
  },

});

export default CreateTripScreen; 