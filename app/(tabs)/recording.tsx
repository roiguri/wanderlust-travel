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
    backgroundColor: theme.semanticColors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacingPatterns.screen.horizontal,
  },
  title: {
    ...theme.textStyles.h1,
    color: theme.semanticColors.text.primary,
    marginBottom: theme.spacing[2],
    includeFontPadding: false,
  },
  subtitle: {
    ...theme.textStyles.body1,
    color: theme.semanticColors.text.secondary,
    textAlign: 'center',
    includeFontPadding: false,
  },
});