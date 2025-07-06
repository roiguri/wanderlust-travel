import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider } from '@/contexts/AuthContext';
import { ReduxProvider } from '@/contexts/ReduxProvider';
import { ToastContainer } from '@/components/ui/Toast';
import SettingsModal from '@/components/modals/SettingsModal';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import { useAppSelector } from '@/store/hooks';
import { useModals } from '@/hooks/useUI';

function AppContent() {
  const toasts = useAppSelector((state) => state.ui.toasts);
  const { isSettingsOpen, closeSettings } = useModals();

  return (
    <ErrorBoundary>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
      <ToastContainer toasts={toasts} />
      <SettingsModal isVisible={isSettingsOpen} onClose={closeSettings} />
    </ErrorBoundary>
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