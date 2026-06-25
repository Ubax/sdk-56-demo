import { Stack } from "expo-router";
import { DynamicColorIOS, StyleSheet, Text, useColorScheme, View } from "react-native";

import { Colors } from "@/constants/theme";
import { toolbarSpacerWidth, useToolbarIcons } from "@/lib/use-toolbar-icons";

export type LibraryToolbarProps = {
  selecting: boolean;
  selectedCount: number;
  // Open select mode (iOS "Select" button; Android enters it by long-press).
  onStartSelect: () => void;
  // Leave select mode and clear the selection (header X).
  onExitSelect: () => void;
  // Select every photo ("Select All" in the overflow menu).
  onSelectAll: () => void;
};

const isAndroid = process.env.EXPO_OS === "android";

// White over dark content, black over light. On iOS 26 DynamicColorIOS adapts
// to the content behind the transparent header. Android has no such transparent
// overlay, so read the theme color directly.
function useLabelColor() {
  const scheme = useColorScheme();
  if (process.env.EXPO_OS === "ios") {
    return DynamicColorIOS({ light: "#000000", dark: "#FFFFFF" });
  }
  return Colors[scheme === "dark" ? "dark" : "light"].text;
}

// The native Library header + (iOS) select-mode bottom toolbar. Rendered as a
// sibling of the grid; `Stack.Toolbar` registers via context, not by position.
// Web has no native toolbar — see `library-toolbar.web.tsx`.
export function LibraryToolbar({
  selecting,
  selectedCount,
  onStartSelect,
  onExitSelect,
  onSelectAll,
}: LibraryToolbarProps) {
  const icons = useToolbarIcons();
  const labelColor = useLabelColor();

  return (
    <>
      <Stack.Toolbar placement="left">
        <Stack.Toolbar.View hidesSharedBackground>
          <View>
            <Text style={[styles.title, { color: labelColor }]}>Library</Text>
            <Text style={[styles.subtitle, { color: labelColor }]}>2 Sep 2025</Text>
          </View>
        </Stack.Toolbar.View>
      </Stack.Toolbar>

      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Menu icon={icons.filter} title="Filter">
          {/* SF Symbol icons here show on iOS; Android renders the dropdown
              rows as text-only (its native menu ignores SF Symbols). */}
          <Stack.Toolbar.MenuAction icon="photo" onPress={() => {}}>
            All Photos
          </Stack.Toolbar.MenuAction>
          <Stack.Toolbar.MenuAction icon="heart" onPress={() => {}}>
            Favorites
          </Stack.Toolbar.MenuAction>
          <Stack.Toolbar.MenuAction icon="video" onPress={() => {}}>
            Videos
          </Stack.Toolbar.MenuAction>
        </Stack.Toolbar.Menu>
        <Stack.Toolbar.Menu icon={icons.more} title="More" hidden={!selecting}>
          <Stack.Toolbar.MenuAction icon="checkmark.circle" onPress={onSelectAll}>
            Select All
          </Stack.Toolbar.MenuAction>
        </Stack.Toolbar.Menu>
        <Stack.Toolbar.Button
          icon={icons.select}
          hidden={isAndroid || selecting}
          onPress={onStartSelect}
        >
          Select
        </Stack.Toolbar.Button>
        <Stack.Toolbar.Button
          icon={icons.close}
          hidden={!selecting}
          separateBackground
          onPress={onExitSelect}
        />
      </Stack.Toolbar>

      {/* Bottom toolbar is iOS-only. On Android the native bottom toolbar is a
          full-screen Compose overlay that swallows taps on the grid, so select
          actions there live in the header (X to exit) instead. */}
      {process.env.EXPO_OS === "ios" && selecting && (
        <Stack.Toolbar placement="bottom">
          <Stack.Toolbar.Button
            icon={icons.share}
            disabled={selectedCount === 0}
            onPress={() => {}}
          />
          <Stack.Toolbar.Spacer width={toolbarSpacerWidth} />
          <Stack.Toolbar.View hidesSharedBackground>
            <View style={styles.selectionLabelWrap}>
              <Text style={[styles.selectionLabel, { color: labelColor }]}>
                {selectedCount === 0
                  ? "Select Items"
                  : `${selectedCount} ${selectedCount === 1 ? "Photo" : "Photos"} Selected`}
              </Text>
            </View>
          </Stack.Toolbar.View>
          <Stack.Toolbar.Spacer width={toolbarSpacerWidth} />
          <Stack.Toolbar.Button
            icon={icons.trash}
            disabled={selectedCount === 0}
            onPress={() => {}}
          />
        </Stack.Toolbar>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 13,
    opacity: 0.6,
    paddingBottom: 8,
  },
  selectionLabelWrap: {
    width: 220,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  selectionLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
});
