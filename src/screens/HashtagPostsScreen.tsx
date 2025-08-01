import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {
  Text,
  Card,
  Chip,
  Avatar,
  IconButton,
  useTheme,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import postsData from '../assets/data/posts.json';

interface HashtagPost {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  image: string;
  caption: string;
  likes: number;
  timestamp: string;
}

const HashtagPostsScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();

  const [posts, setPosts] = useState<HashtagPost[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const hashtag = route.params?.hashtag || '';

  useEffect(() => {
    loadHashtagPosts();
  }, [hashtag]);

  const loadHashtagPosts = () => {
    // Get hashtag posts from the data
    const hashtagPosts = postsData.hashtags[hashtag.replace('#', '')] || [];
    setPosts(hashtagPosts);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHashtagPosts();
    setRefreshing(false);
  };

  const handleUserPress = (userId: string) => {
    navigation.navigate('UserProfile' as never, { userId } as never);
  };

  const handleLike = (postId: string) => {
    // TODO: Implement like functionality
    console.log('Like post:', postId);
  };

  const handleShare = (post: HashtagPost) => {
    // TODO: Implement share functionality
    console.log('Share post:', post.id);
  };

  const renderPost = ({ item }: { item: HashtagPost }) => (
    <Card style={styles.postCard}>
      <View style={styles.cardContent}>
        {/* Header */}
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
            </View>
          </TouchableOpacity>
          <Text variant="bodySmall" style={styles.timestamp}>
            {item.timestamp}
          </Text>
        </View>

        {/* Image */}
        <Image
          source={{ uri: item.image }}
          style={styles.postImage}
          resizeMode="cover"
        />

        {/* Actions */}
        <View style={styles.actionButtons}>
          <View style={styles.leftActions}>
            <IconButton
              icon="heart-outline"
              iconColor="#374151"
              size={24}
              onPress={() => handleLike(item.id)}
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
      </View>
    </Card>
  );

  return (
    <SafeAreaView style={[
      styles.container,
      {
        paddingTop: Math.min(insets.top, 4),
        paddingBottom: Math.min(insets.bottom, 12),
        paddingHorizontal: 16,
      }
    ]}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          onPress={() => navigation.goBack()}
        />
        <Text variant="titleLarge" style={styles.headerTitle}>
          {hashtag}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Posts */}
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.postsList}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="hashtag" size={64} color="#9CA3AF" />
            <Text variant="titleMedium" style={styles.emptyTitle}>
              No posts found
            </Text>
            <Text variant="bodyMedium" style={styles.emptySubtitle}>
              No posts found for {hashtag}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#1F2937',
  },
  headerSpacer: {
    width: 48,
  },
  postsList: {
    paddingBottom: 16,
  },
  postCard: {
    marginBottom: 16,
    elevation: 4,
    borderRadius: 16,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardContent: {
    overflow: 'hidden',
    borderRadius: 16,
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
  },
  avatar: {
    marginRight: 12,
  },
  userDetails: {},
  userName: {
    fontWeight: 'bold',
    marginBottom: 2,
    color: '#1F2937',
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
    paddingBottom: 16,
  },
  caption: {
    lineHeight: 20,
    color: '#1F2937',
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
  },
});

export default HashtagPostsScreen; 