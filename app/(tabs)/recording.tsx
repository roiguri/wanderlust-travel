import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '@/theme';

export default function RecordingTab() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Recording</Text>
        <Text style={styles.subtitle}>Capture your travel experiences in real-time</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacingPatterns.screen.horizontal,
  },
  title: {
    ...theme.h1,
    color: theme.text.primary,
    marginBottom: theme.spacing[2],
    includeFontPadding: false,
  },
  subtitle: {
    ...theme.body1,
    color: theme.text.secondary,
    textAlign: 'center',
    includeFontPadding: false,
  },
});