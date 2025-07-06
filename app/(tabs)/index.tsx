import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { 
  Button, 
  Card, 
  FormInput, 
  LoadingSpinner, 
  Avatar, 
  Badge, 
  EmptyState 
} from '@/components/ui';
import { 
  User, 
  Star, 
  MapPin, 
  Camera, 
  Heart,
  Plus,
  Search,
  Bell,
  Settings
} from 'lucide-react-native';
import { theme } from '@/theme';
import { useToasts, useLoading, useModals } from '@/hooks/useUI';

export default function ExploreTab() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showEmptyState, setShowEmptyState] = useState(false);
  
  const { showSuccessToast, showErrorToast, showWarningToast, showInfoToast } = useToasts();
  const { setGlobalLoading } = useLoading();
  const { openSettings } = useModals();

  const handlePrimaryAction = () => {
    showSuccessToast('Success!', 'Primary button was pressed successfully.');
  };

  const handleSecondaryAction = () => {
    showInfoToast('Info', 'Secondary button was pressed.');
  };

  const handleCardPress = () => {
    showWarningToast('Card Tapped', 'You tapped an interactive card.');
  };

  const handleLogin = async () => {
    setLoading(true);
    setGlobalLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setGlobalLoading(false);
      if (email && password) {
        showSuccessToast('Login Successful', `Welcome back, ${email}!`);
      } else {
        showErrorToast('Login Failed', 'Please enter both email and password.');
      }
    }, 2000);
  };
  
  const handleTestModal = () => {
    openSettings();
    setTimeout(() => {
      showInfoToast('Modal Test', 'Settings modal was opened.');
    }, 500);
  };

  const handleEmptyStateAction = () => {
    setShowEmptyState(false);
    showSuccessToast('Action Completed', 'Empty state action was triggered.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.title}>Design System</Text>
          <Text style={styles.subtitle}>Enhanced component library with theme integration and Redux UI state</Text>
          
          {/* Button Examples */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Enhanced Buttons</Text>
            <Text style={styles.sectionDescription}>Multiple variants, sizes, and states with icon support</Text>
            
            <View style={styles.buttonRow}>
              <Button
                title="Primary Large"
                onPress={handlePrimaryAction}
                variant="primary"
                size="large"
                style={styles.buttonSpacing}
              />
            </View>
            
            <View style={styles.buttonRow}>
              <Button
                title="Primary"
                onPress={handlePrimaryAction}
                variant="primary"
                style={styles.buttonSpacing}
              />
              <Button
                title="Secondary"
                onPress={handleSecondaryAction}
                variant="secondary"
                style={styles.buttonSpacing}
              />
            </View>
            
            <View style={styles.buttonRow}>
              <Button
                title="Outline"
                onPress={handlePrimaryAction}
                variant="outline"
                size="small"
                style={styles.buttonSpacing}
              />
              <Button
                title="Ghost"
                onPress={handlePrimaryAction}
                variant="ghost"
                size="small"
                style={styles.buttonSpacing}
              />
              <Button
                title="Danger"
                onPress={handlePrimaryAction}
                variant="danger"
                size="small"
                style={styles.buttonSpacing}
              />
            </View>
            
            <View style={styles.buttonRow}>
              <Button
                title="With Icon"
                onPress={handlePrimaryAction}
                variant="primary"
                size="small"
                icon={<Plus size={16} color="white" />}
                style={styles.buttonSpacing}
              />
              <Button
                title="Loading"
                onPress={handleLogin}
                variant="primary"
                size="small"
                loading={loading}
                style={styles.buttonSpacing}
              />
              <Button
                title="Disabled"
                onPress={handlePrimaryAction}
                variant="primary"
                size="small"
                disabled
              />
            </View>
          </Card>

          {/* Enhanced Form Inputs */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Enhanced Form Inputs</Text>
            <Text style={styles.sectionDescription}>Validation states, icons, and password toggle</Text>
            
            <FormInput
              label="Email Address"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              required
              leftIcon={<User size={20} color={theme.text.secondary} />}
              helperText="We'll never share your email"
            />
            
            <FormInput
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              required
              showPasswordToggle
              success={password.length >= 8 ? "Strong password" : undefined}
            />
            
            <FormInput
              label="Search Location"
              placeholder="Where would you like to go?"
              leftIcon={<Search size={20} color={theme.text.secondary} />}
              rightIcon={<MapPin size={20} color={theme.text.secondary} />}
              variant="filled"
            />
            
            <FormInput
              label="Invalid Input"
              placeholder="This field has an error"
              error="Please enter a valid destination"
              variant="outlined"
            />
            
            <Button
              title={loading ? "Signing In..." : "Sign In"}
              onPress={handleLogin}
              variant="primary"
              loading={loading}
              fullWidth
              style={{ marginTop: theme.spacing[2] }}
            />
          </Card>

          {/* Avatar Examples */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Avatars</Text>
            <Text style={styles.sectionDescription}>Profile pictures with fallbacks and variants</Text>
            
            <View style={styles.avatarRow}>
              <View style={styles.avatarItem}>
                <Avatar
                  source={{ uri: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400' }}
                  size="small"
                  showBorder
                />
                <Text style={styles.avatarLabel}>Small</Text>
              </View>
              
              <View style={styles.avatarItem}>
                <Avatar
                  name="John Doe"
                  size="medium"
                  showBorder
                />
                <Text style={styles.avatarLabel}>Initials</Text>
              </View>
              
              <View style={styles.avatarItem}>
                <Avatar
                  source={{ uri: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=400' }}
                  size="large"
                  variant="rounded"
                  showBorder
                />
                <Text style={styles.avatarLabel}>Rounded</Text>
              </View>
              
              <View style={styles.avatarItem}>
                <Avatar
                  size="xlarge"
                  variant="square"
                />
                <Text style={styles.avatarLabel}>Fallback</Text>
              </View>
            </View>
          </Card>

          {/* Badge Examples */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Badges</Text>
            <Text style={styles.sectionDescription}>Status indicators and labels</Text>
            
            <View style={styles.badgeRow}>
              <Badge variant="default">Default</Badge>
              <Badge variant="primary">Primary</Badge>
              <Badge variant="success" icon={<Star size={12} color="white" />}>
                Featured
              </Badge>
            </View>
            
            <View style={styles.badgeRow}>
              <Badge variant="warning" size="small">Warning</Badge>
              <Badge variant="error" size="medium">Error</Badge>
              <Badge variant="info" size="large">Information</Badge>
            </View>
          </Card>

          {/* Card Variants */}
          <Card variant="elevated" style={styles.section}>
            <Text style={styles.cardTitle}>Elevated Card</Text>
            <Text style={styles.cardDescription}>
              This card has enhanced shadow for more prominence. Perfect for featured content.
            </Text>
          </Card>
          
          <Card variant="outlined" style={styles.section}>
            <Text style={styles.cardTitle}>Outlined Card</Text>
            <Text style={styles.cardDescription}>
              This card uses a border instead of shadow for a cleaner look.
            </Text>
          </Card>
          
          <Card onPress={handleCardPress} style={styles.section}>
            <Text style={styles.cardTitle}>Interactive Card</Text>
            <Text style={styles.cardDescription}>
              This card shows toast notifications when tapped. Try pressing it!
            </Text>
          </Card>

          {/* Loading Spinner */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>Loading States</Text>
            <Text style={styles.sectionDescription}>Various loading indicators</Text>
            
            <View style={styles.loadingRow}>
              <LoadingSpinner size="small" message="Loading..." />
              <LoadingSpinner size="medium" color={theme.colors.secondary[500]} />
              <LoadingSpinner size="large" color={theme.colors.error} />
            </View>
          </Card>
          
          {/* UI State Demo */}
          <Card style={styles.section}>
            <Text style={styles.sectionTitle}>UI State Management</Text>
            <Text style={styles.sectionDescription}>
              Redux-powered UI state including toasts, loading states, and modal management
            </Text>
            
            <View style={styles.buttonRow}>
              <Button
                title="Success Toast"
                onPress={() => showSuccessToast('Success!', 'This is a success message.')}
                variant="primary"
                size="small"
                style={styles.buttonSpacing}
              />
              <Button
                title="Error Toast"
                onPress={() => showErrorToast('Error!', 'This is an error message.')}
                variant="secondary"
                size="small"
                style={styles.buttonSpacing}
              />
            </View>
            
            <View style={styles.buttonRow}>
              <Button
                title="Warning Toast"
                onPress={() => showWarningToast('Warning!', 'This is a warning message.')}
                variant="outline"
                size="small"
                style={styles.buttonSpacing}
              />
              <Button
                title="Settings Modal"
                onPress={handleTestModal}
                variant="ghost"
                size="small"
                icon={<Settings size={16} color={theme.colors.primary[500]} />}
                style={styles.buttonSpacing}
              />
            </View>
            
            <Button
              title={showEmptyState ? "Hide Empty State" : "Show Empty State"}
              onPress={() => setShowEmptyState(!showEmptyState)}
              variant="outline"
              fullWidth
              style={{ marginTop: theme.spacing[3] }}
            />
          </Card>

          {/* Empty State Example */}
          {showEmptyState && (
            <Card style={styles.section}>
              <EmptyState
                icon={<Heart size={48} color={theme.colors.gray[400]} />}
                title="No favorites yet"
                description="Start exploring and save places you love to see them here."
                actionLabel="Explore Places"
                onAction={handleEmptyStateAction}
              />
            </Card>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: theme.spacingPatterns.screen.horizontal,
  },
  title: {
    ...theme.h2,
    color: theme.text.primary,
    marginBottom: theme.spacing[2],
    textAlign: 'center',
    includeFontPadding: false,
  },
  subtitle: {
    ...theme.body1,
    color: theme.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing[6],
    includeFontPadding: false,
  },
  section: {
    marginBottom: theme.spacing[6],
  },
  sectionTitle: {
    ...theme.h4,
    color: theme.text.primary,
    marginBottom: theme.spacing[2],
    includeFontPadding: false,
  },
  sectionDescription: {
    ...theme.body2,
    color: theme.text.secondary,
    marginBottom: theme.spacing[4],
    includeFontPadding: false,
  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom: theme.spacing[3],
    flexWrap: 'wrap',
  },
  buttonSpacing: {
    marginRight: theme.spacing[3],
    marginBottom: theme.spacing[2],
  },
  cardTitle: {
    ...theme.h5,
    color: theme.text.primary,
    marginBottom: theme.spacing[2],
    includeFontPadding: false,
  },
  cardDescription: {
    ...theme.body2,
    color: theme.text.secondary,
    includeFontPadding: false,
  },
  avatarRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: theme.spacing[2],
  },
  avatarItem: {
    alignItems: 'center',
  },
  avatarLabel: {
    ...theme.caption,
    color: theme.text.secondary,
    marginTop: theme.spacing[1],
    includeFontPadding: false,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing[2],
    marginBottom: theme.spacing[2],
  },
  loadingRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: theme.spacing[4],
  },
});