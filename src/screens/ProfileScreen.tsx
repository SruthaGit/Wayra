import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Text,
  Card,
  Button,
  Avatar,
  List,
  useTheme,
  Divider,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';

const ProfileScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const menuItems = [
    {
      title: 'Edit Profile',
      icon: 'account-edit',
      onPress: () => {/* TODO: Navigate to edit profile */},
    },
    {
      title: 'My Badges',
      icon: 'medal',
      onPress: () => navigation.navigate('Badges' as never),
    },
    {
      title: 'Friends',
      icon: 'account-group',
      onPress: () => navigation.navigate('Friends' as never),
    },
    {
      title: 'Notifications',
      icon: 'bell',
      onPress: () => navigation.navigate('Notifications' as never),
    },
    {
      title: 'Settings',
      icon: 'cog',
      onPress: () => navigation.navigate('Settings' as never),
    },
    {
      title: 'Help & Support',
      icon: 'help-circle',
      onPress: () => {/* TODO: Navigate to help */},
    },
    {
              title: 'About Journi',
      icon: 'information',
      onPress: () => {/* TODO: Navigate to about */},
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView}>
        {/* Profile Header */}
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.secondary]}
          style={styles.header}
        >
          <View style={styles.profileInfo}>
            <Avatar.Image
              size={100}
              source={{ uri: user?.avatar }}
              style={styles.avatar}
            />
            <Text variant="headlineSmall" style={styles.userName}>
              {user?.firstName} {user?.lastName}
            </Text>
            <Text variant="bodyLarge" style={styles.username}>
              @{user?.username}
            </Text>
            {user?.bio && (
              <Text variant="bodyMedium" style={styles.bio}>
                {user.bio}
              </Text>
            )}
          </View>
        </LinearGradient>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Ionicons name="location-outline" size={24} color={theme.colors.primary} />
              <Text variant="titleLarge" style={styles.statNumber}>
                {user?.stats.totalPlaces || 0}
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Places Visited
              </Text>
            </Card.Content>
          </Card>
          
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Ionicons name="flag" size={24} color={theme.colors.secondary} />
              <Text variant="titleLarge" style={styles.statNumber}>
                {user?.stats.countriesVisited || 0}
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Countries
              </Text>
            </Card.Content>
          </Card>
          
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Ionicons name="star" size={24} color={theme.colors.accent} />
              <Text variant="titleLarge" style={styles.statNumber}>
                {user?.stats.averageRating || 0}
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Avg Rating
              </Text>
            </Card.Content>
          </Card>
        </View>

        {/* Recent Activity */}
        <Card style={styles.activityCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.cardTitle}>
              Recent Activity
            </Text>
            <View style={styles.activityItem}>
              <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
              <Text variant="bodyMedium" style={styles.activityText}>
                Checked in at Central Park
              </Text>
              <Text variant="bodySmall" style={styles.activityTime}>
                2 hours ago
              </Text>
            </View>
            <View style={styles.activityItem}>
              <Ionicons name="star" size={20} color={theme.colors.accent} />
              <Text variant="bodyMedium" style={styles.activityText}>
                Reviewed The Metropolitan Museum
              </Text>
              <Text variant="bodySmall" style={styles.activityTime}>
                1 day ago
              </Text>
            </View>
            <View style={styles.activityItem}>
                              <Ionicons name="location-outline" size={20} color={theme.colors.primary} />
              <Text variant="bodyMedium" style={styles.activityText}>
                Added Tokyo to wishlist
              </Text>
              <Text variant="bodySmall" style={styles.activityTime}>
                3 days ago
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Menu Items */}
        <Card style={styles.menuCard}>
          <Card.Content style={styles.menuContent}>
            {menuItems.map((item, index) => (
              <React.Fragment key={item.title}>
                <List.Item
                  title={item.title}
                  left={(props) => <List.Icon {...props} icon={item.icon} />}
                  right={(props) => <List.Icon {...props} icon="chevron-right" />}
                  onPress={item.onPress}
                  style={styles.menuItem}
                />
                {index < menuItems.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </Card.Content>
        </Card>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <Button
            mode="outlined"
            onPress={handleLogout}
            style={styles.logoutButton}
            textColor={theme.colors.error}
            buttonColor="transparent"
            icon="logout"
          >
            Sign Out
          </Button>
        </View>
      </ScrollView>
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
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  profileInfo: {
    alignItems: 'center',
  },
  avatar: {
    marginBottom: 16,
    borderWidth: 4,
    borderColor: 'white',
  },
  userName: {
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  username: {
    color: 'white',
    opacity: 0.9,
    marginBottom: 8,
  },
  bio: {
    color: 'white',
    opacity: 0.8,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: -20,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    elevation: 4,
  },
  statContent: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  statNumber: {
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    textAlign: 'center',
    opacity: 0.7,
  },
  activityCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  cardTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  activityText: {
    flex: 1,
    marginLeft: 12,
  },
  activityTime: {
    opacity: 0.5,
  },
  menuCard: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  menuContent: {
    paddingVertical: 8,
  },
  menuItem: {
    paddingVertical: 4,
  },
  logoutContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  logoutButton: {
    borderColor: '#DC2626',
  },
});

export default ProfileScreen; 