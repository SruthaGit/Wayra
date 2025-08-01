import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {
  Text,
  TextInput,
  IconButton,
  Avatar,
  useTheme,
} from 'react-native-paper';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const { height } = Dimensions.get('window');

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

interface CommentModalProps {
  visible: boolean;
  onClose: () => void;
  comments: Comment[];
  onAddComment: (comment: string) => void;
}

const CommentModal: React.FC<CommentModalProps> = ({
  visible,
  onClose,
  comments,
  onAddComment,
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [newComment, setNewComment] = useState('');

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(newComment.trim());
      setNewComment('');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text variant="titleMedium" style={styles.headerTitle}>
            Comments
          </Text>
          <IconButton
            icon="close"
            size={24}
            onPress={onClose}
          />
        </View>

        {/* Comments List */}
        <ScrollView style={styles.commentsList}>
          {comments.map((comment) => (
            <View key={comment.id} style={styles.commentItem}>
              <Avatar.Image
                size={32}
                source={{ uri: comment.user.avatar }}
                style={styles.commentAvatar}
              />
              <View style={styles.commentContent}>
                <Text variant="bodyMedium" style={styles.commentText}>
                  <Text style={styles.commentUserName}>{comment.user.name}</Text> {comment.text}
                </Text>
                <Text variant="bodySmall" style={styles.commentTimestamp}>
                  {comment.timestamp}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Comment Input */}
        <View style={styles.commentInput}>
          <TextInput
            mode="outlined"
            placeholder="Add a comment..."
            value={newComment}
            onChangeText={setNewComment}
            style={styles.commentTextInput}
            right={
              <TextInput.Icon
                icon="send"
                onPress={handleAddComment}
                disabled={!newComment.trim()}
              />
            }
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
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
  headerTitle: {
    fontWeight: 'bold',
    color: '#1F2937',
  },
  commentsList: {
    flex: 1,
    padding: 16,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  commentAvatar: {
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentText: {
    lineHeight: 20,
    color: '#1F2937',
  },
  commentUserName: {
    fontWeight: 'bold',
  },
  commentTimestamp: {
    marginTop: 4,
    opacity: 0.5,
    color: '#6B7280',
  },
  commentInput: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  commentTextInput: {
    backgroundColor: 'white',
  },
});

export default CommentModal; 