import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider } from '@/contexts/AuthContext';
import { ReduxProvider } from '@/contexts/ReduxProvider';
import { ToastContainer } from '@/components/ui/Toast';
import { useAppSelector } from '@/store/hooks';

function AppContent() {
  const toasts = useAppSelector((state) => state.ui.toasts);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
      <ToastContainer toasts={toasts} />
    </>
  );
}

export default function RootLayout() {
  useFrameworkReady();

  return (
    <ReduxProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ReduxProvider>
  );
}