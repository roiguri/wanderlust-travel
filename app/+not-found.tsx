import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '@/theme';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <Text style={styles.text}>This screen doesn't exist.</Text>
        <Link href="/" style={styles.link}>
          <Text>Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacingPatterns.screen.horizontal,
    backgroundColor: theme.semanticColors.background,
  },
  text: {
    ...theme.textStyles.h4,
    color: theme.semanticColors.text.primary,
    includeFontPadding: false,
  },
  link: {
    marginTop: theme.spacing[4],
    paddingVertical: theme.spacing[4],
  },
});
