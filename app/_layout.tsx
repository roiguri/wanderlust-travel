import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider } from '@/contexts/AuthContext';
import { ReduxProvider } from '@/contexts/ReduxProvider';
import { ToastContainer } from '@/components/ui/Toast';
import { LoadingOverlay } from '@/components/ui/LoadingOverlay';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <ReduxProvider>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
        <ToastContainer />
        <LoadingOverlay />
      </AuthProvider>
    </ReduxProvider>
  );
}
