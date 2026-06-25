import { Stack } from "expo-router";

// iOS-only transparent header: content scrolls under it. `transparent` alone
// handles the clear background/shadow. Renders nothing on Android/web, which use
// the default opaque app bar.
export function IOSTransparentHeader() {
  if (process.env.EXPO_OS !== "ios") return null;
  return <Stack.Header transparent blurEffect="none" />;
}
