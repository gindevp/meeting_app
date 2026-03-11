import { Tabs } from 'expo-router';
import React from 'react';

import { TopBar } from '@/components/TopBar';
import { Colors } from '@/constants/theme';
import { useNavVisibility } from '@/contexts/NavVisibilityContext';
import { WebViewPathProvider } from '@/contexts/WebViewPathContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

const THEME_PRIMARY = '#1e3a5f';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { showNav } = useNavVisibility();

  return (
    <WebViewPathProvider>
      <Tabs
        initialRouteName="index"
        screenOptions={{
          tabBarActiveTintColor: THEME_PRIMARY,
          tabBarInactiveTintColor: Colors[colorScheme ?? 'light'].tabIconDefault,
          headerShown: showNav,
          header: showNav ? () => <TopBar /> : undefined,
          tabBarStyle: { display: 'none' },
          sceneContainerStyle: { flex: 1 },
        }}>
        <Tabs.Screen name="index" options={{ title: 'Trang chủ' }} />
        <Tabs.Screen name="dashboard" options={{ href: null }} />
        <Tabs.Screen name="notifications" options={{ href: null }} />
        <Tabs.Screen name="profile" options={{ href: null }} />
        <Tabs.Screen name="explore" options={{ href: null }} />
      </Tabs>
    </WebViewPathProvider>
  );
}
