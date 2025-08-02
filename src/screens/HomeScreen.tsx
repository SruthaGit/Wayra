import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Dimensions,
  Image,
  TouchableOpacity,
  Linking,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Text,
  Card,
  Chip,
  Avatar,
  useTheme,
  FAB,
  IconButton,
  TextInput,
  Button,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import postsData from '../assets/data/posts.json';
import CommentModal from './CommentModal';

const { width, height } = Dimensions.get('window');

interface FeedPost {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  location: {
    name: string;
    city: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  timestamp: string;
  image: string;
  caption: string;
  tags: string[];
  likes: number;
  comments: number;
  isLiked: boolean;
}

interface Comment {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  text: string;
  timestamp: string;
}

const HomeScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<FeedPost | null>(null);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    loadFeedData();
  }, []);

  const loadFeedData = async () => {
    // Convert posts data to FeedPost format
    const feedPosts: FeedPost[] = postsData.posts.map(post => ({
      id: post.id,
      user: post.user,
      location: post.location,
      timestamp: post.timestamp,
      image: post.image,
      caption: post.caption,
      tags: post.tags,
      likes: post.likes,
      comments: post.comments.length,
      isLiked: post.isLiked,
    }));

    setPosts(feedPosts);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFeedData();
    setRefreshing(false);
  };

  const handleLike = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const handleComment = (post: FeedPost) => {
    setSelectedPost(post);
    setShowCommentsModal(true);
  };

  const handleCreatePost = () => {
    // TODO: Navigate to create post screen
    console.log('Create new post');
  };

  const handleOpenInMaps = (coordinates?: { latitude: number; longitude: number }) => {
    if (coordinates) {
      const url = `https://www.google.com/maps?q=${coordinates.latitude},${coordinates.longitude}`;
      Linking.openURL(url).catch(err => {
        console.error('Error opening maps:', err);
      });
    }
  };

  const handleUserPress = (userId: string) => {
    navigation.navigate('UserProfile' as never, { userId } as never);
  };

  const handleHashtagPress = (hashtag: string) => {
    navigation.navigate('HashtagPosts' as never, { hashtag } as never);
  };

  const handleImagePress = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  const handleShare = (post: FeedPost) => {
    const Share = require('react-native').Share;
    Share.share({
      message: `Check out this post from ${post.user.name}: ${post.caption}`,
              title: 'Shared from Journi',
    }).catch((error: any) => {
      console.error('Error sharing:', error);
    });
  };

  const handleAddComment = () => {
    if (newComment.trim() && selectedPost) {
      // TODO: Add comment to database
      console.log('Adding comment:', newComment);
      setNewComment('');
      setShowCommentsModal(false);
    }
  };

  const renderFeedItem = ({ item }: { item: FeedPost }) => (
    <View style={styles.feedItem}>
        {/* Header with user info */}
        <View style={styles.postHeader}>
          <TouchableOpacity
            style={styles.userInfo}
            onPress={() => handleUserPress(item.user.id)}
          >
            <Avatar.Image 
              size={40} 
              source={{ uri: item.user.avatar }} 
              style={styles.avatar}
            />
            <View style={styles.userDetails}>
              <Text variant="titleSmall" style={styles.userName}>
                {item.user.name}
              </Text>
              <View style={styles.locationContainer}>
                <Ionicons name="location-outline" size={14} color="#5A67D8" />
                <TouchableOpacity 
                  onPress={() => handleOpenInMaps(item.location.coordinates)}
                  style={styles.locationTextContainer}
                >
                  <Text variant="bodySmall" style={styles.locationText}>
                    {item.location.name}, {item.location.city}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
          <Text variant="bodySmall" style={styles.timestamp}>
            {item.timestamp}
          </Text>
        </View>

        {/* Location image */}
        <TouchableOpacity onPress={() => handleImagePress(item.image)}>
          <Image 
            source={{ uri: item.image }} 
            style={styles.postImage}
            resizeMode="cover"
          />
        </TouchableOpacity>

        {/* Action buttons */}
        <View style={styles.actionButtons}>
          <View style={styles.leftActions}>
            <IconButton
              icon={item.isLiked ? "heart" : "heart-outline"}
              iconColor={item.isLiked ? "#E53E3E" : "#374151"}
              size={24}
              onPress={() => handleLike(item.id)}
            />
            <IconButton
              icon="chat-outline"
              iconColor="#374151"
              size={24}
              onPress={() => handleComment(item)}
            />
            <IconButton
              icon="share-outline"
              iconColor="#374151"
              size={24}
              onPress={() => handleShare(item)}
            />
          </View>
          <View style={styles.rightActions}>
            <Text variant="bodySmall" style={styles.likesCount}>
              {item.likes} likes
            </Text>
          </View>
        </View>

        {/* Caption */}
        <View style={styles.captionContainer}>
          <Text variant="bodyMedium" style={styles.caption}>
            <Text style={styles.userName}>{item.user.name}</Text> {item.caption}
          </Text>
        </View>

        {/* Tags */}
        {item.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {item.tags.map((tag) => (
              <TouchableOpacity
                key={tag}
                onPress={() => handleHashtagPress(tag)}
              >
                <Chip style={styles.tag} textStyle={styles.tagText}>
                  #{tag}
                </Chip>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Comments preview */}
        <TouchableOpacity
          onPress={() => handleComment(item)}
          style={styles.commentsPreview}
        >
          <Text variant="bodySmall" style={styles.commentsText}>
            View all {item.comments} comments
          </Text>
        </TouchableOpacity>
      </View>
    );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        


        {/* Feed List */}
        <FlatList
          data={posts}
          renderItem={renderFeedItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.feedList}
        />

        {/* Create Post FAB */}
        <FAB
          icon="plus"
          style={[
            styles.fab,
            {
              bottom: Math.max(insets.bottom, 12),
            }
          ]}
          onPress={handleCreatePost}
        />

        {/* Comments Modal */}
        <CommentModal
          visible={showCommentsModal}
          onClose={() => setShowCommentsModal(false)}
          comments={selectedPost ? postsData.posts.find(p => p.id === selectedPost.id)?.comments || [] : []}
          onAddComment={handleAddComment}
        />

        {/* Image Fullscreen Modal */}
        <Modal
          visible={showImageModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowImageModal(false)}
        >
          <View style={styles.imageModalContainer}>
            <TouchableOpacity
              style={styles.imageModalClose}
              onPress={() => setShowImageModal(false)}
            >
              <Ionicons name="close" size={30} color="#FFFFFF" />
            </TouchableOpacity>
            <Image 
              source={{ uri: selectedImage }} 
              style={styles.fullscreenImage}
              resizeMode="contain"
            />
          </View>
        </Modal>
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
    marginTop: -5,
  },


  feedList: {
    paddingBottom: 0,
    paddingTop: 0,
    marginTop: -10,
  },
  feedItem: {
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontWeight: 'bold',
    marginBottom: 2,
    color: '#1F2937',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationTextContainer: {
    marginLeft: 4,
  },
  locationText: {
    color: '#5A67D8',
    fontWeight: '500',
  },
  timestamp: {
    opacity: 0.5,
    fontSize: 12,
    color: '#6B7280',
  },
  postImage: {
    width: '100%',
    height: 300,
    borderRadius: 0,
    marginVertical: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likesCount: {
    fontWeight: 'bold',
    color: '#1F2937',
  },
  captionContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  caption: {
    lineHeight: 20,
    color: '#1F2937',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingBottom: 8,
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
  commentsPreview: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  commentsText: {
    opacity: 0.6,
    color: '#6B7280',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    backgroundColor: '#5A67D8',
  },
  // Image modal styles
  imageModalContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageModalClose: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
    padding: 10,
  },
  fullscreenImage: {
    width: width,
    height: height * 0.8,
  },
});

export default HomeScreen; 