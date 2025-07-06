import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { X, Moon, Sun, Globe, Bell, Shield, CircleHelp as HelpCircle } from 'lucide-react-native';
import Modal from '@/components/ui/Modal';
import { theme } from '@/theme';
import { useUI } from '@/hooks/useUI';

interface SettingsModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isVisible, onClose }: SettingsModalProps) {
  const { theme: currentTheme, setTheme } = useUI();

  const settingsSections = [
    {
      title: 'Appearance',
      icon: currentTheme === 'dark' ? Moon : Sun,
      items: [
        {
          label: 'Dark Mode',
          type: 'switch' as const,
          value: currentTheme === 'dark',
          onToggle: (value: boolean) => setTheme(value ? 'dark' : 'light'),
        },
      ],
    },
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        {
          label: 'Push Notifications',
          type: 'switch' as const,
          value: true,
          onToggle: (value: boolean) => console.log('Push notifications:', value),
        },
        {
          label: 'Trip Reminders',
          type: 'switch' as const,
          value: true,
          onToggle: (value: boolean) => console.log('Trip reminders:', value),
        },
        {
          label: 'Weather Alerts',
          type: 'switch' as const,
          value: false,
          onToggle: (value: boolean) => console.log('Weather alerts:', value),
        },
      ],
    },
    {
      title: 'Privacy',
      icon: Shield,
      items: [
        {
          label: 'Share Location',
          type: 'switch' as const,
          value: false,
          onToggle: (value: boolean) => console.log('Share location:', value),
        },
        {
          label: 'Public Profile',
          type: 'switch' as const,
          value: false,
          onToggle: (value: boolean) => console.log('Public profile:', value),
        },
      ],
    },
    {
      title: 'Support',
      icon: HelpCircle,
      items: [
        {
          label: 'Help Center',
          type: 'action' as const,
          onPress: () => console.log('Help center'),
        },
        {
          label: 'Contact Support',
          type: 'action' as const,
          onPress: () => console.log('Contact support'),
        },
        {
          label: 'Privacy Policy',
          type: 'action' as const,
          onPress: () => console.log('Privacy policy'),
        },
      ],
    },
  ];

  return (
    <Modal isVisible={isVisible} onClose={onClose}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <X size={24} color={theme.text.secondary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <View style={styles.sectionHeader}>
              <section.icon size={20} color={theme.colors.primary[500]} />
              <Text style={styles.sectionTitle}>{section.title}</Text>
            </View>
            
            {section.items.map((item, itemIndex) => (
              <View key={itemIndex} style={styles.settingItem}>
                <Text style={styles.settingLabel}>{item.label}</Text>
                {item.type === 'switch' ? (
                  <Switch
                    value={item.value}
                    onValueChange={item.onToggle}
                    trackColor={{
                      false: theme.colors.gray[300],
                      true: theme.colors.primary[500],
                    }}
                    thumbColor={theme.surface}
                  />
                ) : (
                  <TouchableOpacity onPress={item.onPress} style={styles.actionButton}>
                    <Text style={styles.actionText}>Open</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
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
    maxHeight: 500,
  },
  section: {
    marginBottom: theme.spacing[6],
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing[3],
  },
  sectionTitle: {
    ...theme.h5,
    color: theme.text.primary,
    marginLeft: theme.spacing[2],
    includeFontPadding: false,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: theme.border.light,
  },
  settingLabel: {
    ...theme.body1,
    color: theme.text.primary,
    flex: 1,
    includeFontPadding: false,
  },
  actionButton: {
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[1],
  },
  actionText: {
    ...theme.body2,
    color: theme.colors.primary[500],
    includeFontPadding: false,
  },
});