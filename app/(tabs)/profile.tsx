import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/contexts/AuthContext';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { fetchUserProfileAsync, logoutAsync } from '@/store/slices/authSlice';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import EditProfileModal from '@/components/modals/EditProfileModal';
import SettingsModal from '@/components/modals/SettingsModal';
import { User, Settings, LogOut, Mail, Calendar, CreditCard as Edit3, MapPin, Camera, Award, TrendingUp } from 'lucide-react-native';
import { theme } from '@/theme';
import { useToasts } from '@/hooks/useUI';

export default function ProfileTab() {
  // Use both Redux and AuthContext for migration period
  const { logout: authLogout } = useAuth();
  const dispatch = useAppDispatch();
  
  // Redux state
  const reduxUser = useAppSelector((state) => state.auth.user);
  const reduxLoading = useAppSelector((state) => state.auth.isLoading);
  const reduxError = useAppSelector((state) => state.auth.error);
  
  // AuthContext fallback
  const { user: contextUser } = useAuth();
  
  // Use Redux user if available, fallback to context user
  const user = reduxUser || contextUser;
  const loading = reduxLoading;
  const error = reduxError;

  const { showSuccessToast, showErrorToast } = useToasts();
  
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    // Try to fetch fresh profile data from Redux
    if (reduxUser) {
      dispatch(fetchUserProfileAsync());
    }
  }, [dispatch, reduxUser]);

  const handleLogout = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoggingOut(true);
              
              // Try Redux logout first, fallback to AuthContext
              if (reduxUser) {
                await dispatch(logoutAsync()).unwrap();
              } else {
                await authLogout();
              }
              
              showSuccessToast('Signed Out', 'You have been signed out successfully');
            } catch (error: any) {
              console.error('Logout error:', error);
              showErrorToast('Error', 'Failed to sign out. Please try again.');
            } finally {
              setLoggingOut(false);
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return 'Unknown';
    }
  };

  // Mock stats for demonstration
  const userStats = [
    { icon: MapPin, label: 'Trips Planned', value: '12' },
    { icon: Camera, label: 'Photos Taken', value: '248' },
    { icon: Award, label: 'Places Visited', value: '34' },
    { icon: TrendingUp, label: 'Miles Traveled', value: '15.2K' },
  ];

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary[500]} />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && !user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button
            title="Retry"
            onPress={() => dispatch(fetchUserProfileAsync())}
            variant="primary"
            size="medium"
            style={styles.retryButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Profile</Text>
            <TouchableOpacity 
              style={styles.settingsButton} 
              activeOpacity={0.7}
              onPress={() => setSettingsModalVisible(true)}
            >
              <Settings size={24} color={theme.text.secondary} />
            </TouchableOpacity>
          </View>

          {/* Profile Card */}
          <Card style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <View style={styles.avatarContainer}>
                {user?.profile_picture_url ? (
                  <Image
                    source={{ uri: user.profile_picture_url }}
                    style={styles.avatar}
                  />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <User size={40} color={theme.text.inverse} />
                  </View>
                )}
                <TouchableOpacity 
                  style={styles.editAvatarButton} 
                  activeOpacity={0.7}
                  onPress={() => setEditModalVisible(true)}
                >
                  <Edit3 size={16} color={theme.text.inverse} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.profileInfo}>
                <Text style={styles.username}>{user?.username || 'Unknown User'}</Text>
                <View style={styles.emailContainer}>
                  <Mail size={16} color={theme.text.secondary} />
                  <Text style={styles.email}>{user?.email || 'No email'}</Text>
                </View>
                <Text style={styles.memberSince}>
                  Member since {user?.created_at ? formatDate(user.created_at) : 'Unknown'}
                </Text>
              </View>
            </View>
          </Card>

          {/* Stats Grid */}
          <Card style={styles.statsCard}>
            <Text style={styles.sectionTitle}>Travel Stats</Text>
            <View style={styles.statsGrid}>
              {userStats.map((stat, index) => (
                <View key={index} style={styles.statItem}>
                  <View style={styles.statIconContainer}>
                    <stat.icon size={24} color={theme.colors.primary[500]} />
                  </View>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>
          </Card>

          {/* Account Information */}
          <Card style={styles.infoCard}>
            <Text style={styles.sectionTitle}>Account Information</Text>
            
            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <User size={20} color={theme.text.secondary} />
                <Text style={styles.infoLabelText}>Username</Text>
              </View>
              <Text style={styles.infoValue}>{user?.username || 'Not set'}</Text>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <Mail size={20} color={theme.text.secondary} />
                <Text style={styles.infoLabelText}>Email</Text>
              </View>
              <Text style={styles.infoValue}>{user?.email || 'Not set'}</Text>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <Calendar size={20} color={theme.text.secondary} />
                <Text style={styles.infoLabelText}>Member since</Text>
              </View>
              <Text style={styles.infoValue}>
                {user?.created_at ? formatDate(user.created_at) : 'Unknown'}
              </Text>
            </View>
          </Card>

          {/* Error Message */}
          {error && (
            <Card style={styles.errorCard}>
              <Text style={styles.errorCardText}>
                Some profile data may be outdated. {error}
              </Text>
              <Button
                title="Refresh"
                onPress={() => dispatch(fetchUserProfileAsync())}
                variant="secondary"
                size="small"
                style={styles.refreshButton}
              />
            </Card>
          )}

          {/* Actions */}
          <View style={styles.actionsContainer}>
            <Button
              title="Edit Profile"
              onPress={() => setEditModalVisible(true)}
              variant="secondary"
              size="large"
              style={styles.actionButton}
            />

            <Button
              title={loggingOut ? "Signing Out..." : "Sign Out"}
              onPress={handleLogout}
              variant="primary"
              size="large"
              loading={loggingOut}
              style={[styles.actionButton, styles.signOutButton]}
            />
          </View>
        </View>
      </ScrollView>

      {/* Modals */}
      <EditProfileModal
        isVisible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
      />
      
      <SettingsModal
        isVisible={settingsModalVisible}
        onClose={() => setSettingsModalVisible(false)}
      />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: theme.spacing[4],
    ...theme.body1,
    color: theme.text.secondary,
    includeFontPadding: false,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing[5],
  },
  errorText: {
    ...theme.body1,
    color: theme.colors.error,
    textAlign: 'center',
    marginBottom: theme.spacing[5],
    includeFontPadding: false,
  },
  retryButton: {
    minWidth: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[6],
  },
  title: {
    ...theme.h1,
    color: theme.text.primary,
    includeFontPadding: false,
  },
  settingsButton: {
    padding: theme.spacing[2],
  },
  profileCard: {
    marginBottom: theme.spacing[6],
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: theme.spacing[4],
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.surface,
  },
  profileInfo: {
    flex: 1,
  },
  username: {
    ...theme.h3,
    color: theme.text.primary,
    marginBottom: theme.spacing[1],
    includeFontPadding: false,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[1],
  },
  email: {
    ...theme.body2,
    color: theme.text.secondary,
    marginLeft: theme.spacing[2],
    includeFontPadding: false,
  },
  memberSince: {
    ...theme.caption,
    color: theme.text.secondary,
    includeFontPadding: false,
  },
  statsCard: {
    marginBottom: theme.spacing[6],
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: theme.spacing[4],
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing[2],
  },
  statValue: {
    ...theme.h4,
    color: theme.text.primary,
    marginBottom: theme.spacing[1],
    includeFontPadding: false,
  },
  statLabel: {
    ...theme.caption,
    color: theme.text.secondary,
    textAlign: 'center',
    includeFontPadding: false,
  },
  infoCard: {
    marginBottom: theme.spacing[6],
  },
  sectionTitle: {
    ...theme.h4,
    color: theme.text.primary,
    marginBottom: theme.spacing[4],
    includeFontPadding: false,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray[100],
  },
  infoLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoLabelText: {
    ...theme.body1,
    color: theme.text.secondary,
    marginLeft: theme.spacing[3],
    includeFontPadding: false,
  },
  infoValue: {
    ...theme.body1,
    color: theme.text.primary,
    fontWeight: theme.typography.fontWeights.medium,
    textAlign: 'right',
    flex: 1,
    includeFontPadding: false,
  },
  errorCard: {
    backgroundColor: theme.colors.error + '10',
    borderWidth: 1,
    borderColor: theme.colors.error + '30',
    marginBottom: theme.spacing[6],
  },
  errorCardText: {
    color: theme.colors.error,
    ...theme.body2,
    marginBottom: theme.spacing[3],
    includeFontPadding: false,
  },
  refreshButton: {
    alignSelf: 'flex-start',
  },
  actionsContainer: {
    gap: theme.spacing[4],
  },
  actionButton: {
    marginBottom: 0,
  },
  signOutButton: {
    backgroundColor: theme.colors.error,
    borderColor: theme.colors.error,
  },
});