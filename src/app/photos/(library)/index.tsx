import { useTabBarHidden } from "@/components/tab-bar-visibility";
import { PhotoCell } from "@/components/photo-cell";
import { Colors } from "@/constants/theme";
import { PHOTOS } from "@/lib/photos";
import { toolbarSpacerWidth, useToolbarIcons } from "@/lib/use-toolbar-icons";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import {
  DynamicColorIOS,
  FlatList,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";

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

const isAndroid = process.env.EXPO_OS === "android";

export default function LibraryScreen() {
  const [selecting, setSelecting] = useState(false);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const icons = useToolbarIcons();
  const labelColor = useLabelColor();

  const selectedCount = selected.size;

  // Android: select mode is driven by long-press and ends when the selection
  // empties (or via the header X). iOS keeps an empty select mode open.
  useEffect(() => {
    if (isAndroid && selecting && selectedCount === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing select mode to an emptied selection
      setSelecting(false);
    }
  }, [selecting, selectedCount]);

  // Hide the native tab bar in select mode so the bottom toolbar owns the
  // bottom edge (the only way out of select mode is the header X).
  const { setHidden } = useTabBarHidden();
  useEffect(() => {
    setHidden(selecting);
    return () => setHidden(false);
  }, [selecting, setHidden]);

  function toggle(id: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  // Android long-press: enter select mode, keeping any existing selection.
  function startSelection(id: number) {
    setSelecting(true);
    setSelected((prev) => new Set(prev).add(id));
  }

  function exitSelection() {
    setSelecting(false);
    setSelected(new Set());
  }

  return (
    <>
      {process.env.EXPO_OS !== "web" && (
        <>
          <Stack.Toolbar placement="left">
            <Stack.Toolbar.View hidesSharedBackground>
              <View>
                <Text style={[styles.title, { color: labelColor }]}>
                  Library
                </Text>
                <Text style={[styles.subtitle, { color: labelColor }]}>
                  2 Sep 2025
                </Text>
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
            <Stack.Toolbar.Menu
              icon={icons.more}
              title="More"
              hidden={!selecting}
            >
              <Stack.Toolbar.MenuAction
                icon="checkmark.circle"
                onPress={() => setSelected(new Set(PHOTOS.map((p) => p.id)))}
              >
                Select All
              </Stack.Toolbar.MenuAction>
            </Stack.Toolbar.Menu>
            <Stack.Toolbar.Button
              icon={icons.select}
              hidden={isAndroid || selecting}
              onPress={() => setSelecting(true)}
            >
              Select
            </Stack.Toolbar.Button>
            <Stack.Toolbar.Button
              icon={icons.close}
              hidden={!selecting}
              separateBackground
              onPress={exitSelection}
            />
          </Stack.Toolbar>
        </>
      )}

      <FlatList
        data={PHOTOS}
        keyExtractor={(photo) => String(photo.id)}
        numColumns={3}
        contentInsetAdjustmentBehavior="automatic"
        renderItem={({ item: photo }) => (
          <PhotoCell
            photo={photo}
            selecting={selecting}
            selected={selected.has(photo.id)}
            onToggle={toggle}
            onLongPress={isAndroid ? startSelection : undefined}
          />
        )}
      />

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
                  : `${selectedCount} ${
                      selectedCount === 1 ? "Photo" : "Photos"
                    } Selected`}
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
