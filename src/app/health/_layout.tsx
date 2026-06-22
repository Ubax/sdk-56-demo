import { NativeTabs } from 'expo-router/unstable-native-tabs';

// Native tabs render as a real UITabBar on iOS and a Material 3 navigation bar on
// Android — the Expo Router "native tabs" feature, nested inside the root Stack.
export default function HealthTabsLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="summary">
        <NativeTabs.Trigger.Icon sf="heart.fill" drawable="ic_menu_today" />
        <NativeTabs.Trigger.Label>Summary</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
