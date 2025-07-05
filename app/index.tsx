import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { theme } from '@/theme';

export default function IndexScreen() {
  const { isLoggedIn, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isLoggedIn) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/login');
      }
    }
  }, [isLoggedIn, isLoading]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#FF385C" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.semanticColors.background,
  },
});