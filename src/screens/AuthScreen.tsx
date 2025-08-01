import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  useTheme,
  HelperText,
  Divider,
} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';

const AuthScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { login, register, isLoading } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    username: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin) {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }

      if (!formData.firstName) {
        newErrors.firstName = 'First name is required';
      }

      if (!formData.lastName) {
        newErrors.lastName = 'Last name is required';
      }

      if (!formData.username) {
        newErrors.username = 'Username is required';
      } else if (formData.username.length < 3) {
        newErrors.username = 'Username must be at least 3 characters';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          username: formData.username,
        });
      }
    } catch (error) {
      console.error('Auth error:', error);
      // Handle error (show toast, etc.)
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      username: '',
    });
    setErrors({});
  };

  return (
    <LinearGradient
      colors={[theme.colors.primary, theme.colors.secondary]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Ionicons name="compass" size={80} color="white" />
            <Text variant="displaySmall" style={styles.appTitle}>
              Wayra
            </Text>
            <Text variant="titleMedium" style={styles.appSubtitle}>
              {isLogin ? 'Welcome back!' : 'Join the adventure'}
            </Text>
          </View>

          {/* Auth Form */}
          <Card style={styles.formCard}>
            <Card.Content style={styles.formContent}>
              <Text variant="headlineSmall" style={styles.formTitle}>
                {isLogin ? 'Sign In' : 'Create Account'}
              </Text>

              {!isLogin && (
                <>
                  <View style={styles.nameRow}>
                    <TextInput
                      label="First Name"
                      value={formData.firstName}
                      onChangeText={(value) => handleInputChange('firstName', value)}
                      style={styles.halfInput}
                      mode="outlined"
                      error={!!errors.firstName}
                    />
                    <TextInput
                      label="Last Name"
                      value={formData.lastName}
                      onChangeText={(value) => handleInputChange('lastName', value)}
                      style={styles.halfInput}
                      mode="outlined"
                      error={!!errors.lastName}
                    />
                  </View>
                  {errors.firstName && <HelperText type="error">{errors.firstName}</HelperText>}
                  {errors.lastName && <HelperText type="error">{errors.lastName}</HelperText>}

                  <TextInput
                    label="Username"
                    value={formData.username}
                    onChangeText={(value) => handleInputChange('username', value)}
                    mode="outlined"
                    error={!!errors.username}
                    left={<TextInput.Icon icon="account" />}
                  />
                  {errors.username && <HelperText type="error">{errors.username}</HelperText>}
                </>
              )}

              <TextInput
                label="Email"
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                mode="outlined"
                error={!!errors.email}
                keyboardType="email-address"
                autoCapitalize="none"
                left={<TextInput.Icon icon="email" />}
              />
              {errors.email && <HelperText type="error">{errors.email}</HelperText>}

              <TextInput
                label="Password"
                value={formData.password}
                onChangeText={(value) => handleInputChange('password', value)}
                mode="outlined"
                error={!!errors.password}
                secureTextEntry={!showPassword}
                left={<TextInput.Icon icon="lock" />}
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
              />
              {errors.password && <HelperText type="error">{errors.password}</HelperText>}

              {!isLogin && (
                <>
                  <TextInput
                    label="Confirm Password"
                    value={formData.confirmPassword}
                    onChangeText={(value) => handleInputChange('confirmPassword', value)}
                    mode="outlined"
                    error={!!errors.confirmPassword}
                    secureTextEntry={!showConfirmPassword}
                    left={<TextInput.Icon icon="lock" />}
                    right={
                      <TextInput.Icon
                        icon={showConfirmPassword ? 'eye-off' : 'eye'}
                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      />
                    }
                  />
                  {errors.confirmPassword && <HelperText type="error">{errors.confirmPassword}</HelperText>}
                </>
              )}

              <Button
                mode="contained"
                onPress={handleSubmit}
                style={styles.submitButton}
                loading={isLoading}
                disabled={isLoading}
              >
                {isLogin ? 'Sign In' : 'Create Account'}
              </Button>

              <Divider style={styles.divider} />

              <View style={styles.socialButtons}>
                <Button
                  mode="outlined"
                  icon="google"
                  style={styles.socialButton}
                  onPress={() => {/* TODO: Implement Google auth */}}
                >
                  Continue with Google
                </Button>
                
                <Button
                  mode="outlined"
                  icon="apple"
                  style={styles.socialButton}
                  onPress={() => {/* TODO: Implement Apple auth */}}
                >
                  Continue with Apple
                </Button>
              </View>

              <View style={styles.switchMode}>
                <Text variant="bodyMedium">
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                </Text>
                <Button
                  mode="text"
                  onPress={toggleMode}
                  style={styles.switchButton}
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </Button>
              </View>
            </Card.Content>
          </Card>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  appTitle: {
    color: 'white',
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  appSubtitle: {
    color: 'white',
    opacity: 0.9,
  },
  formCard: {
    elevation: 8,
    borderRadius: 16,
  },
  formContent: {
    paddingVertical: 24,
  },
  formTitle: {
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: 'bold',
  },
  nameRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  submitButton: {
    marginTop: 24,
    marginBottom: 16,
    paddingVertical: 8,
  },
  divider: {
    marginVertical: 16,
  },
  socialButtons: {
    gap: 12,
  },
  socialButton: {
    marginBottom: 8,
  },
  switchMode: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  switchButton: {
    marginLeft: 4,
  },
});

export default AuthScreen; 