import React from 'react';
import {
  Modal as RNModal,
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StatusBar,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { theme } from '@/theme';

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  animationType?: 'slide' | 'fade' | 'none';
  presentationStyle?: 'fullScreen' | 'pageSheet' | 'formSheet' | 'overFullScreen';
  showCloseButton?: boolean;
}

export default function Modal({
  isVisible,
  onClose,
  children,
  animationType = 'slide',
  presentationStyle = 'overFullScreen',
  showCloseButton = true,
}: ModalProps) {
  return (
    <RNModal
      visible={isVisible}
      animationType={animationType}
      presentationStyle={presentationStyle}
      transparent={presentationStyle === 'overFullScreen'}
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {Platform.OS === 'ios' && presentationStyle === 'overFullScreen' ? (
        <BlurView intensity={20} style={styles.overlay}>
          <TouchableWithoutFeedback onPress={onClose}>
            <View style={styles.backdrop} />
          </TouchableWithoutFeedback>
          <View style={styles.modalContainer}>
            {children}
          </View>
        </BlurView>
      ) : (
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={onClose}>
            <View style={styles.backdrop} />
          </TouchableWithoutFeedback>
          <View style={styles.modalContainer}>
            {children}
          </View>
        </View>
      )}
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    backgroundColor: theme.surface,
    borderRadius: theme.componentRadius.modal,
    padding: theme.spacing[6],
    margin: theme.spacing[4],
    maxWidth: 400,
    width: '90%',
    maxHeight: '80%',
    ...theme.componentShadows.modal,
  },
});