import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SystemUI from 'expo-system-ui';
import { useEffect } from 'react';
import { Platform, PlatformColor, useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/splash/animated-icon';
import { useTheme } from '@/hooks/use-theme';
import { NewEventHeader } from '@/screens/new-event-header';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = useTheme();

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(theme.background);
  }, [theme.background]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <Stack
        screenOptions={{
          headerBackButtonDisplayMode: 'minimal',
          headerLargeTitleEnabled: true,
          contentStyle: { backgroundColor: theme.background },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ title: 'Settings' }} />
        <Stack.Screen name="health" options={{ headerShown: false }} />
        <Stack.Screen name="photos" options={{ headerShown: false }} />
        <Stack.Screen name="widget-demo" options={{ title: '' }} />
        <Stack.Screen name="server" options={{ title: 'Server Demo' }} />
        <Stack.Screen name="secret" options={{ title: 'Secret Loader' }} />
        <Stack.Screen
          name="new-event"
          options={{
            headerLargeTitleEnabled: false,
            presentation: 'formSheet',
            sheetAllowedDetents: [1.0],
            sheetGrabberVisible: false,
            title: 'New',
            // The transparent header, grouped-gray sheet background the inset cards
            // sit on, plus the custom glass SwiftUI header — iOS only (UIKit colors /
            // SwiftUI). On Android the transparent header has nothing to compensate
            // for it (no custom header, no top inset), so the default opaque app bar
            // is used and the form content sits below it.
            ...(Platform.OS === 'ios'
              ? {
                  headerTransparent: true,
                  contentStyle: {
                    backgroundColor: PlatformColor('systemGroupedBackground'),
                  },
                  header: () => <NewEventHeader />,
                }
              : {}),
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
