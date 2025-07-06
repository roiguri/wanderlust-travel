import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { X, Camera, User } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import Modal from '@/components/ui/Modal';
import FormInput from '@/components/ui/FormInput';
import Button from '@/components/ui/Button';
import { theme } from '@/theme';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { updateUser } from '@/store/slices/authSlice';
import { useToasts } from '@/hooks/useUI';

interface EditProfileModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function EditProfileModal({ isVisible, onClose }: EditProfileModalProps) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { showSuccessToast, showErrorToast } = useToasts();
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; email?: string }>({});

  useEffect(() => {
    if (user) {
      setUsername(user.username || '');
      setEmail(user.email || '');
      setProfilePicture(user.profile_picture_url || null);
    }
  }, [user]);

  const validateForm = () => {
    const newErrors: { username?: string; email?: string } = {};
    
    if (!username.trim()) {
      newErrors.username = 'Username is required';
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Sorry, we need camera roll permissions to change your profile picture.'
        );
        return false;
      }
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setProfilePicture(result.assets[0].uri);
      }
    } catch (error) {
      showErrorToast('Error', 'Failed to pick image');
    }
  };

  const takePhoto = async () => {
    if (Platform.OS === 'web') {
      showErrorToast('Not Available', 'Camera is not available on web');
      return;
    }

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Sorry, we need camera permissions to take a photo.'
      );
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setProfilePicture(result.assets[0].uri);
      }
    } catch (error) {
      showErrorToast('Error', 'Failed to take photo');
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Profile Picture',
      'Choose an option',
      [
        { text: 'Camera', onPress: takePhoto },
        { text: 'Photo Library', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      // Update user in Redux store
      dispatch(updateUser({
        username: username.trim(),
        email: email.trim(),
        profile_picture_url: profilePicture || undefined,
        updated_at: new Date().toISOString(),
      }));

      showSuccessToast('Success', 'Profile updated successfully');
      onClose();
    } catch (error) {
      showErrorToast('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // Reset form to original values
    if (user) {
      setUsername(user.username || '');
      setEmail(user.email || '');
      setProfilePicture(user.profile_picture_url || null);
    }
    setErrors({});
    onClose();
  };

  return (
    <Modal isVisible={isVisible} onClose={handleClose}>
      <View style={styles.header}>
        <Text style={styles.title}>Edit Profile</Text>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <X size={24} color={theme.text.secondary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Picture Section */}
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={showImageOptions} style={styles.avatarContainer}>
            {profilePicture ? (
              <Image source={{ uri: profilePicture }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <User size={40} color={theme.text.inverse} />
              </View>
            )}
            <View style={styles.cameraButton}>
              <Camera size={16} color={theme.text.inverse} />
            </View>
          </TouchableOpacity>
          <Text style={styles.avatarHint}>Tap to change photo</Text>
        </View>

        {/* Form Fields */}
        <FormInput
          label="Username"
          value={username}
          onChangeText={setUsername}
          error={errors.username}
          placeholder="Enter your username"
          autoCapitalize="none"
          required
        />

        <FormInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          error={errors.email}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          required
        />
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Cancel"
          onPress={handleClose}
          variant="secondary"
          style={styles.cancelButton}
        />
        <Button
          title={loading ? "Saving..." : "Save Changes"}
          onPress={handleSave}
          loading={loading}
          style={styles.saveButton}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing[6],
  },
  title: {
    ...theme.h3,
    color: theme.text.primary,
    includeFontPadding: false,
  },
  closeButton: {
    padding: theme.spacing[1],
  },
  content: {
    maxHeight: 400,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: theme.spacing[6],
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: theme.spacing[2],
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: theme.colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: theme.surface,
  },
  avatarHint: {
    ...theme.caption,
    color: theme.text.secondary,
    includeFontPadding: false,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing[6],
    gap: theme.spacing[3],
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1,
  },
});