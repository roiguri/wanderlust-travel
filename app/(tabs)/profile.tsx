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
import { getUserProfile } from '@/lib/api';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { User, Settings, LogOut, Mail, Calendar, CreditCard as Edit3 } from 'lucide-react-native';

interface UserProfile {
  id: string;
  email: string;
  username: string;
  profile_picture_url?: string;
  preferences: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export default function ProfileTab() {
  const { user: contextUser, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const profileData = await getUserProfile();
      setProfile(profileData);
    } catch (err: any) {
      console.error('Error fetching profile:', err);
      setError(err.message || 'Failed to load profile');
      // Fallback to context user if API fails
      if (contextUser) {
        setProfile(contextUser);
      }
    } finally {
      setLoading(false);
    }
  };

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
              await logout();
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
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

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF385C" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error && !profile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button
            title="Retry"
            onPress={fetchProfile}
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
            <TouchableOpacity style={styles.settingsButton} activeOpacity={0.7}>
              <Settings size={24} color="#717171" />
            </TouchableOpacity>
          </View>

          {/* Profile Card */}
          <Card style={styles.profileCard}>
            <View style={styles.profileHeader}>
              <View style={styles.avatarContainer}>
                {profile?.profile_picture_url ? (
                  <Image
                    source={{ uri: profile.profile_picture_url }}
                    style={styles.avatar}
                  />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <User size={40} color="#ffffff" />
                  </View>
                )}
                <TouchableOpacity style={styles.editAvatarButton} activeOpacity={0.7}>
                  <Edit3 size={16} color="#ffffff" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.profileInfo}>
                <Text style={styles.username}>{profile?.username || 'Unknown User'}</Text>
                <View style={styles.emailContainer}>
                  <Mail size={16} color="#717171" />
                  <Text style={styles.email}>{profile?.email || 'No email'}</Text>
                </View>
              </View>
            </View>
          </Card>

          {/* Account Information */}
          <Card style={styles.infoCard}>
            <Text style={styles.sectionTitle}>Account Information</Text>
            
            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <User size={20} color="#717171" />
                <Text style={styles.infoLabelText}>Username</Text>
              </View>
              <Text style={styles.infoValue}>{profile?.username || 'Not set'}</Text>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <Mail size={20} color="#717171" />
                <Text style={styles.infoLabelText}>Email</Text>
              </View>
              <Text style={styles.infoValue}>{profile?.email || 'Not set'}</Text>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoLabel}>
                <Calendar size={20} color="#717171" />
                <Text style={styles.infoLabelText}>Member since</Text>
              </View>
              <Text style={styles.infoValue}>
                {profile?.created_at ? formatDate(profile.created_at) : 'Unknown'}
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
                onPress={fetchProfile}
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
              onPress={() => Alert.alert('Coming Soon', 'Profile editing will be available soon!')}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#717171',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#dc2626',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    minWidth: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#222222',
  },
  settingsButton: {
    padding: 8,
  },
  profileCard: {
    marginBottom: 24,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
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
    backgroundColor: '#FF385C',
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
    backgroundColor: '#FF385C',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  profileInfo: {
    flex: 1,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 8,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  email: {
    fontSize: 16,
    color: '#717171',
    marginLeft: 8,
  },
  infoCard: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222222',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  infoLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoLabelText: {
    fontSize: 16,
    color: '#717171',
    marginLeft: 12,
  },
  infoValue: {
    fontSize: 16,
    color: '#222222',
    fontWeight: '500',
    textAlign: 'right',
    flex: 1,
  },
  errorCard: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    marginBottom: 24,
  },
  errorCardText: {
    color: '#dc2626',
    fontSize: 14,
    marginBottom: 12,
  },
  refreshButton: {
    alignSelf: 'flex-start',
  },
  actionsContainer: {
    gap: 16,
  },
  actionButton: {
    marginBottom: 0,
  },
  signOutButton: {
    backgroundColor: '#dc2626',
    borderColor: '#dc2626',
  },
});