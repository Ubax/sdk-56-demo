import { Stack } from 'expo-router/stack';
import { Platform, PlatformColor } from 'react-native';

// iOS uses a transparent header: large titles, blur, and the grid scrolls under
// it (inset via `contentInsetAdjustmentBehavior`). Android has no such overlay,
// so it falls back to the navigation theme's opaque, theme-aware header and the
// grid simply sits below it. PlatformColor stays iOS-only — `label` is an iOS
// resource and crashes if resolved on Android.
const iosHeaderOptions =
  Platform.OS === 'ios'
    ? {
        headerTransparent: true,
        headerBlurEffect: 'none' as const,
        headerLargeStyle: { backgroundColor: 'transparent' },
        headerStyle: { backgroundColor: 'transparent' },
        headerTitleStyle: { color: PlatformColor('label') },
      }
    : undefined;

export default function LibraryLayout() {
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerLargeTitleShadowVisible: false,
        headerLargeTitle: true,
        headerBackButtonDisplayMode: 'minimal',
        ...iosHeaderOptions,
      }}>
      <Stack.Screen name="index" options={{ headerTitle: '', headerLargeTitle: false }} />
      {/* Title is set per-photo (the date) from the screen itself. */}
      <Stack.Screen name="[id]" options={{ headerLargeTitle: false }} />
    </Stack>
  );
}
