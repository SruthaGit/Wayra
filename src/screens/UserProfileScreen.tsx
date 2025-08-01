import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {
  Text,
  Card,
  Button,
  useTheme,
  Avatar,
  Chip,
  IconButton,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import postsData from '../assets/data/posts.json';

const { width } = Dimensions.get('window');

interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  followers: number;
  following: number;
  posts: number;
  location: string;
  website?: string;
}

interface UserPost {
  id: string;
  image: string;
  caption: string;
  likes: number;
  comments: number;
  timestamp: string;
}

const UserProfileScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  
  const [user, setUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<UserPost[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const userId = route.params?.userId;
    if (userId) {
      loadUserProfile(userId);
    }
  }, [route.params]);

  const loadUserProfile = (userId: string) => {
    // Mock user data
    const mockUsers: { [key: string]: User } = {
      'user1': {
        id: 'user1',
        name: 'Sarah Johnson',
        username: 'sarah_travels',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
        bio: 'Adventure seeker & travel photographer 📸 Exploring the world one destination at a time ✈️',
        followers: 1240,
        following: 890,
        posts: 156,
        location: 'New York, NY',
        website: 'sarahjohnson.com',
      },
      'user2': {
        id: 'user2',
        name: 'Mike Chen',
        username: 'mike_explorer',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        bio: 'Food lover & culture enthusiast 🍜 Discovering amazing places and people around the globe 🌍',
        followers: 890,
        following: 567,
        posts: 89,
        location: 'San Francisco, CA',
      },
      'user3': {
        id: 'user3',
        name: 'Emma Davis',
        username: 'emma_adventures',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        bio: 'Hiking enthusiast & nature lover 🏔️ Always looking for the next mountain to climb 🥾',
        followers: 2100,
        following: 1200,
        posts: 234,
        location: 'Denver, CO',
        website: 'emmahikes.com',
      },
      'user4': {
        id: 'user4',
        name: 'Alex Rodriguez',
        username: 'alex_world',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        bio: 'Urban explorer & street photographer 📷 Capturing the energy of cities worldwide 🌆',
        followers: 1560,
        following: 980,
        posts: 187,
        location: 'Los Angeles, CA',
      },
      'user5': {
        id: 'user5',
        name: 'Lisa Wang',
        username: 'lisa_nature',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
        bio: 'Wildlife photographer & conservation advocate 🦁 Protecting our planet through storytelling 🌿',
        followers: 3200,
        following: 1500,
        posts: 298,
        location: 'Seattle, WA',
        website: 'lisawildlife.com',
      },
    };

    const selectedUser = mockUsers[userId];
    if (selectedUser) {
      setUser(selectedUser);
      
      // Get user's posts from the posts data
      const userPostsData = postsData.posts.filter(post => post.user.id === userId);
      const formattedPosts: UserPost[] = userPostsData.map(post => ({
        id: post.id,
        image: post.image,
        caption: post.caption,
        likes: post.likes,
        comments: post.comments.length,
        timestamp: post.timestamp,
      }));
      setUserPosts(formattedPosts);
    }
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const handleMessage = () => {
    // TODO: Navigate to messages
    console.log('Open messages');
  };

  const handlePostPress = (postId: string) => {
    // TODO: Navigate to post detail
    console.log('View post:', postId);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <IconButton
            icon="arrow-left"
            size={24}
            onPress={handleBack}
            style={styles.backButton}
          />
          <Text variant="titleMedium" style={styles.headerTitle}>
            {user.username}
          </Text>
          <IconButton
            icon="dots-horizontal"
            size={24}
            onPress={() => {/* TODO: Show options */}}
          />
        </View>

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <Avatar.Image 
              size={80} 
              source={{ uri: user.avatar }} 
              style={styles.profileAvatar}
            />
            <View style={styles.profileStats}>
              <View style={styles.statItem}>
                <Text variant="titleLarge" style={styles.statNumber}>
                  {user.posts}
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Posts
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="titleLarge" style={styles.statNumber}>
                  {user.followers}
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Followers
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text variant="titleLarge" style={styles.statNumber}>
                  {user.following}
                </Text>
                <Text variant="bodySmall" style={styles.statLabel}>
                  Following
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.profileInfo}>
            <Text variant="titleMedium" style={styles.userName}>
              {user.name}
            </Text>
            <Text variant="bodyMedium" style={styles.userBio}>
              {user.bio}
            </Text>
            
            <View style={styles.profileDetails}>
              {user.location && (
                <View style={styles.detailItem}>
                  <Ionicons name="location-outline" size={16} color="#6B7280" />
                  <Text variant="bodySmall" style={styles.detailText}>
                    {user.location}
                  </Text>
                </View>
              )}
              {user.website && (
                <View style={styles.detailItem}>
                  <Ionicons name="link" size={16} color="#6B7280" />
                  <Text variant="bodySmall" style={styles.detailText}>
                    {user.website}
                  </Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.profileActions}>
            <Button
              mode={isFollowing ? "outlined" : "contained"}
              onPress={handleFollow}
              style={[styles.actionButton, isFollowing && styles.followingButton]}
              textColor={isFollowing ? "#5A67D8" : "#FFFFFF"}
            >
              {isFollowing ? "Following" : "Follow"}
            </Button>
            <Button
              mode="outlined"
              onPress={handleMessage}
              style={styles.actionButton}
              icon="message"
            >
              Message
            </Button>
          </View>
        </View>

        {/* Posts Grid */}
        <View style={styles.postsSection}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Posts
          </Text>
          
          {userPosts.length > 0 ? (
            <View style={styles.postsGrid}>
              {userPosts.map((post) => (
                <TouchableOpacity
                  key={post.id}
                  style={styles.postItem}
                  onPress={() => handlePostPress(post.id)}
                >
                  <Image 
                    source={{ uri: post.image }} 
                    style={styles.postImage}
                    resizeMode="cover"
                  />
                  <View style={styles.postOverlay}>
                    <View style={styles.postStats}>
                      <Ionicons name="heart" size={16} color="#FFFFFF" />
                      <Text style={styles.postStatText}>{post.likes}</Text>
                      <Ionicons name="chat" size={16} color="#FFFFFF" />
                      <Text style={styles.postStatText}>{post.comments}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.emptyPosts}>
              <Ionicons name="camera" size={48} color="#9CA3AF" />
              <Text variant="titleMedium" style={styles.emptyTitle}>
                No posts yet
              </Text>
              <Text variant="bodyMedium" style={styles.emptySubtitle}>
                When {user.name} shares photos and videos, you'll see them here.
              </Text>
            </View>
          )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  profileSection: {
    padding: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  profileAvatar: {
    marginRight: 16,
  },
  profileStats: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statLabel: {
    color: '#6B7280',
    marginTop: 2,
  },
  profileInfo: {
    marginBottom: 16,
  },
  userName: {
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#1F2937',
  },
  userBio: {
    marginBottom: 12,
    lineHeight: 20,
    color: '#374151',
  },
  profileDetails: {
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    marginLeft: 8,
    color: '#6B7280',
  },
  profileActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#5A67D8',
  },
  followingButton: {
    backgroundColor: 'transparent',
    borderColor: '#5A67D8',
  },
  postsSection: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1F2937',
  },
  postsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
  },
  postItem: {
    width: (width - 32 - 4) / 3,
    height: (width - 32 - 4) / 3,
    position: 'relative',
  },
  postImage: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
  postOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  postStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  postStatText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  emptyPosts: {
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
  },
});

export default UserProfileScreen; 