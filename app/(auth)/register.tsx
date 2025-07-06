import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import FormInput from '@/components/ui/FormInput';
import Button from '@/components/ui/Button';
import { Eye, EyeOff, Check, X } from 'lucide-react-native';
import { theme } from '@/theme';

interface PasswordRequirement {
  text: string;
  met: boolean;
}

export default function RegisterScreen() {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Password validation
  const passwordRequirements: PasswordRequirement[] = [
    { text: 'At least 8 characters', met: password.length >= 8 },
    { text: 'One uppercase letter', met: /[A-Z]/.test(password) },
    { text: 'One lowercase letter', met: /[a-z]/.test(password) },
    { text: 'One number', met: /\d/.test(password) },
  ];

  const isPasswordValid = passwordRequirements.every(req => req.met);
  const doPasswordsMatch = password === confirmPassword && password.length > 0;

  const handleRegister = async () => {
    // Validation
    if (!email.trim() || !username.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (!isPasswordValid) {
      setError('Password does not meet requirements');
      return;
    }

    if (!doPasswordsMatch) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      await register({
        email: email.trim().toLowerCase(),
        username: username.trim(),
        password,
      });

      // Navigation will be handled by the auth state change
      router.replace('/(tabs)');
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <Image
              source={{ uri: 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=400' }}
              style={styles.headerImage}
            />
            <View style={styles.overlay} />
            <View style={styles.headerContent}>
              <Text style={styles.welcomeText}>Join Wanderlust</Text>
              <Text style={styles.subtitle}>Start planning your next adventure</Text>
            </View>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <View style={styles.form}>
              <Text style={styles.formTitle}>Create Account</Text>
              
              {error ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <FormInput
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                required
                containerStyle={styles.inputContainer}
              />

              <FormInput
                label="Username"
                placeholder="Choose a username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                autoComplete="username"
                required
                containerStyle={styles.inputContainer}
              />

              <View style={styles.passwordContainer}>
                <FormInput
                  label="Password"
                  placeholder="Create a password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoComplete="new-password"
                  required
                  containerStyle={styles.inputContainer}
                />
                <TouchableOpacity
                  style={styles.passwordToggle}
                  onPress={togglePasswordVisibility}
                  activeOpacity={0.7}
                >
                  {showPassword ? (
                    <EyeOff size={20} color={theme.semanticColors.text.secondary} />
                  ) : (
                    <Eye size={20} color={theme.semanticColors.text.secondary} />
                  )}
                </TouchableOpacity>
              </View>

              {/* Password Requirements */}
              {password.length > 0 && (
                <View style={styles.requirementsContainer}>
                  <Text style={styles.requirementsTitle}>Password Requirements:</Text>
                  {passwordRequirements.map((req, index) => (
                    <View key={index} style={styles.requirement}>
                      {req.met ? (
                        <Check size={16} color={theme.colors.success} />
                      ) : (
                        <X size={16} color={theme.colors.error} />
                      )}
                      <Text style={[
                        styles.requirementText,
                        { color: req.met ? theme.colors.success : theme.colors.error }
                      ]}>
                        {req.text}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              <View style={styles.passwordContainer}>
                <FormInput
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoComplete="new-password"
                  required
                  containerStyle={styles.inputContainer}
                />
                <TouchableOpacity
                  style={styles.passwordToggle}
                  onPress={toggleConfirmPasswordVisibility}
                  activeOpacity={0.7}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} color={theme.semanticColors.text.secondary} />
                  ) : (
                    <Eye size={20} color={theme.semanticColors.text.secondary} />
                  )}
                </TouchableOpacity>
              </View>

              {/* Password Match Indicator */}
              {confirmPassword.length > 0 && (
                <View style={styles.matchContainer}>
                  {doPasswordsMatch ? (
                    <View style={styles.requirement}>
                      <Check size={16} color={theme.colors.success} />
                      <Text style={[styles.requirementText, { color: theme.colors.success }]}>
                        Passwords match
                      </Text>
                    </View>
                  ) : (
                    <View style={styles.requirement}>
                      <X size={16} color={theme.colors.error} />
                      <Text style={[styles.requirementText, { color: theme.colors.error }]}>
                        Passwords do not match
                      </Text>
                    </View>
                  )}
                </View>
              )}

              <Button
                title={loading ? "Creating Account..." : "Create Account"}
                onPress={handleRegister}
                variant="primary"
                size="large"
                loading={loading}
                style={styles.registerButton}
              />

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <Link href="/(auth)/login" asChild>
                  <TouchableOpacity activeOpacity={0.7}>
                    <Text style={styles.loginLink}>Sign in</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    height: 280,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  headerContent: {
    position: 'absolute',
    bottom: theme.spacing[10],
    left: theme.spacingPatterns.screen.horizontal,
    right: theme.spacingPatterns.screen.horizontal,
  },
  welcomeText: {
    ...theme.h1,
    color: theme.text.inverse,
    marginBottom: theme.spacing[2],
    includeFontPadding: false,
  },
  subtitle: {
    ...theme.body1,
    color: theme.text.inverse,
    opacity: 0.9,
    includeFontPadding: false,
  },
  formContainer: {
    flex: 1,
    backgroundColor: theme.surface,
    borderTopLeftRadius: theme.borderRadius['3xl'],
    borderTopRightRadius: theme.borderRadius['3xl'],
    marginTop: -theme.spacing[6],
    paddingTop: theme.spacing[8],
    paddingHorizontal: theme.spacingPatterns.screen.horizontal,
    paddingBottom: theme.spacingPatterns.screen.horizontal,
  },
  form: {
    flex: 1,
  },
  formTitle: {
    ...theme.h3,
    color: theme.text.primary,
    marginBottom: theme.spacing[6],
    textAlign: 'center',
    includeFontPadding: false,
  },
  errorContainer: {
    backgroundColor: theme.colors.error + '10',
    borderWidth: 1,
    borderColor: theme.colors.error + '30',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[3],
    marginBottom: theme.spacing[4],
  },
  errorText: {
    color: theme.colors.error,
    ...theme.body2,
    fontWeight: theme.typography.fontWeights.medium,
    textAlign: 'center',
    includeFontPadding: false,
  },
  inputContainer: {
    marginBottom: theme.spacing[5],
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordToggle: {
    position: 'absolute',
    right: theme.spacing[4],
    top: 44,
    padding: theme.spacing[1],
  },
  requirementsContainer: {
    backgroundColor: theme.colors.gray[50],
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[3],
    marginBottom: theme.spacing[4],
  },
  requirementsTitle: {
    ...theme.body2,
    fontWeight: theme.typography.fontWeights.semibold,
    color: theme.colors.gray[700],
    marginBottom: theme.spacing[2],
    includeFontPadding: false,
  },
  requirement: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[1],
  },
  requirementText: {
    ...theme.body2,
    marginLeft: theme.spacing[2],
    fontWeight: theme.typography.fontWeights.medium,
    includeFontPadding: false,
  },
  matchContainer: {
    marginBottom: theme.spacing[4],
  },
  registerButton: {
    marginTop: theme.spacing[2],
    marginBottom: theme.spacing[6],
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing[6],
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.border.light,
  },
  dividerText: {
    marginHorizontal: theme.spacing[4],
    ...theme.body2,
    color: theme.text.secondary,
    includeFontPadding: false,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing[4],
  },
  loginText: {
    ...theme.body1,
    color: theme.text.secondary,
    includeFontPadding: false,
  },
  loginLink: {
    ...theme.body1,
    color: theme.colors.primary[500],
    fontWeight: theme.typography.fontWeights.semibold,
    includeFontPadding: false,
  },
});