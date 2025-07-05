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
import { Eye, EyeOff } from 'lucide-react-native';
import { theme } from '@/theme';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      await login({
        email: email.trim().toLowerCase(),
        password,
      });

      // Navigation will be handled by the auth state change
      router.replace('/(tabs)');
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
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
              source={{ uri: 'https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=400' }}
              style={styles.headerImage}
            />
            <View style={styles.overlay} />
            <View style={styles.headerContent}>
              <Text style={styles.welcomeText}>Welcome back</Text>
              <Text style={styles.subtitle}>Sign in to continue your journey</Text>
            </View>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <View style={styles.form}>
              <Text style={styles.formTitle}>Sign In</Text>
              
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

              <View style={styles.passwordContainer}>
                <FormInput
                  label="Password"
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoComplete="password"
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

              <Button
                title={loading ? "Signing In..." : "Sign In"}
                onPress={handleLogin}
                variant="primary"
                size="large"
                loading={loading}
                style={styles.loginButton}
              />

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.signupContainer}>
                <Text style={styles.signupText}>Don't have an account? </Text>
                <Link href="/(auth)/register" asChild>
                  <TouchableOpacity activeOpacity={0.7}>
                    <Text style={styles.signupLink}>Sign up</Text>
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
    backgroundColor: theme.semanticColors.background,
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
    ...theme.textStyles.h1,
    color: theme.semanticColors.text.inverse,
    marginBottom: theme.spacing[2],
    includeFontPadding: false,
  },
  subtitle: {
    ...theme.textStyles.body1,
    color: theme.semanticColors.text.inverse,
    opacity: 0.9,
    includeFontPadding: false,
  },
  formContainer: {
    flex: 1,
    backgroundColor: theme.semanticColors.surface,
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
    ...theme.textStyles.h3,
    color: theme.semanticColors.text.primary,
    marginBottom: theme.spacing[6],
    textAlign: 'center',
    includeFontPadding: false,
  },
  errorContainer: {
    backgroundColor: theme.colors.error + '10', // 10% opacity
    borderWidth: 1,
    borderColor: theme.colors.error + '30', // 30% opacity
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing[3],
    marginBottom: theme.spacing[4],
  },
  errorText: {
    color: theme.colors.error,
    ...theme.textStyles.body2,
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
  loginButton: {
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
    backgroundColor: theme.semanticColors.border.light,
  },
  dividerText: {
    marginHorizontal: theme.spacing[4],
    ...theme.textStyles.body2,
    color: theme.semanticColors.text.secondary,
    includeFontPadding: false,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing[4],
  },
  signupText: {
    ...theme.textStyles.body1,
    color: theme.semanticColors.text.secondary,
    includeFontPadding: false,
  },
  signupLink: {
    ...theme.textStyles.body1,
    color: theme.colors.primary[500],
    fontWeight: theme.typography.fontWeights.semibold,
    includeFontPadding: false,
  },
});