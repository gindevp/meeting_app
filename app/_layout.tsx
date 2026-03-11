import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useState } from 'react';
import 'react-native-reanimated';

import { AppSplash } from '@/components/AppSplash';
import { NavVisibilityProvider } from '@/contexts/NavVisibilityContext';
import { PushTokenProvider } from '@/contexts/PushTokenContext';
import { WebViewUserProvider } from '@/contexts/WebViewUserContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [splashDone, setSplashDone] = useState(false);

  const handleSplashFinish = useCallback(() => setSplashDone(true), []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <NavVisibilityProvider>
        <WebViewUserProvider>
          <PushTokenProvider>
            <AppSplash onFinish={handleSplashFinish}>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
              </Stack>
              <StatusBar style="auto" />
            </AppSplash>
          </PushTokenProvider>
        </WebViewUserProvider>
      </NavVisibilityProvider>
    </ThemeProvider>
  );
}
