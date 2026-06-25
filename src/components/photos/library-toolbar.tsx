import { Stack } from "expo-router";
import { DynamicColorIOS, StyleSheet, Text, useColorScheme, View } from "react-native";

import { Colors } from "@/constants/theme";
import { toolbarSpacerWidth, useToolbarIcons } from "@/lib/use-toolbar-icons";

import type { LibraryToolbarProps } from "./library-toolbar.types";

const isAndroid = process.env.EXPO_OS === "android";

function useLabelColor() {
  const scheme = useColorScheme();
  if (process.env.EXPO_OS === "ios") {
    return DynamicColorIOS({ light: Colors.light.text, dark: Colors.dark.text });
  }
  return Colors[scheme === "dark" ? "dark" : "light"].text;
}

export function LibraryToolbar({
  selecting,
  selectedCount,
  onStartSelect,
  onExitSelect,
  onSelectAll,
  onShare,
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
          <Stack.Toolbar.MenuAction icon={icons.allPhotos} onPress={() => {}}>
            All Photos
          </Stack.Toolbar.MenuAction>
          <Stack.Toolbar.MenuAction icon={icons.heart} onPress={() => {}}>
            Favorites
          </Stack.Toolbar.MenuAction>
          <Stack.Toolbar.MenuAction icon={icons.videos} onPress={() => {}}>
            Videos
          </Stack.Toolbar.MenuAction>
        </Stack.Toolbar.Menu>
        <Stack.Toolbar.Menu icon={icons.more} title="More" hidden={!selecting}>
          <Stack.Toolbar.MenuAction icon={icons.selectAll} onPress={onSelectAll}>
            Select All
          </Stack.Toolbar.MenuAction>
          {isAndroid && (
            <Stack.Toolbar.MenuAction
              icon={icons.share}
              disabled={selectedCount === 0}
              onPress={onShare}
            >
              Share
            </Stack.Toolbar.MenuAction>
          )}
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

      {process.env.EXPO_OS === "ios" && selecting && (
        <Stack.Toolbar placement="bottom">
          <Stack.Toolbar.Button
            icon={icons.share}
            disabled={selectedCount === 0}
            onPress={onShare}
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
