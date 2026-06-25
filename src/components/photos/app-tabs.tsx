import { NativeTabs } from "expo-router/unstable-native-tabs";
import { useColorScheme } from "react-native";

import { useTabBarHidden } from "@/components/photos/tab-bar-visibility";
import { Colors } from "@/constants/theme";

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === "dark" ? "dark" : "light"];
  const { hidden } = useTabBarHidden({ ios: true });

  return (
    <NativeTabs
      hidden={hidden}
      backgroundColor={colors.background}
      indicatorColor={colors.backgroundElement}
      labelStyle={{ selected: { color: colors.text } }}
    >
      <NativeTabs.Trigger name="(library)">
        <NativeTabs.Trigger.Label>Library</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="photo.on.rectangle" md="photo_library" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="collections">
        <NativeTabs.Trigger.Label>Collections</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="square.stack" md="collections" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="search" role="search">
        <NativeTabs.Trigger.Label>Search</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="magnifyingglass" md="search" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
