import { Image } from "expo-image";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { StyleSheet, View } from "react-native";

import { useHideTabBar } from "@/components/tab-bar-visibility";
import { getPhoto } from "@/lib/photos";
import { toolbarSpacerWidth, useToolbarIcons } from "@/lib/use-toolbar-icons";

export default function PhotoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const photo = getPhoto(id);
  const icons = useToolbarIcons();

  // Hide the native tab bar (iOS only — see app-tabs) while viewing the photo
  // so the bottom toolbar owns the bottom edge.
  useHideTabBar();

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "2 Sep 2025" }} />

      {process.env.EXPO_OS !== "web" && (
        <>
          <Stack.Toolbar placement="right">
            <Stack.Toolbar.Menu icon={icons.more} title="More">
              {/* SF Symbol icons show on iOS; Android menu rows are text-only. */}
              <Stack.Toolbar.MenuAction
                icon="square.and.arrow.up"
                onPress={() => {}}
              >
                Share
              </Stack.Toolbar.MenuAction>
              <Stack.Toolbar.MenuAction icon="bookmark" onPress={() => {}}>
                Add to Album
              </Stack.Toolbar.MenuAction>
              <Stack.Toolbar.MenuAction icon="doc.on.doc" onPress={() => {}}>
                Duplicate
              </Stack.Toolbar.MenuAction>
            </Stack.Toolbar.Menu>
          </Stack.Toolbar>

          <Stack.Toolbar placement="bottom">
            <Stack.Toolbar.Button icon={icons.share} onPress={() => {}}>
              Share
            </Stack.Toolbar.Button>
            <Stack.Toolbar.Spacer width={toolbarSpacerWidth} />
            {/* Favorite / Info / Adjust have no spacer between them, so they share one glass background. */}
            <Stack.Toolbar.Button icon={icons.heart} onPress={() => {}}>
              Favorite
            </Stack.Toolbar.Button>
            <Stack.Toolbar.Button icon={icons.info} onPress={() => {}}>
              Info
            </Stack.Toolbar.Button>
            <Stack.Toolbar.Button icon={icons.adjust} onPress={() => {}}>
              Adjust
            </Stack.Toolbar.Button>
            <Stack.Toolbar.Spacer width={toolbarSpacerWidth} />
            <Stack.Toolbar.Button icon={icons.trash} onPress={() => {}}>
              Delete
            </Stack.Toolbar.Button>
          </Stack.Toolbar>
        </>
      )}

      <Link.AppleZoomTarget>
        <Image style={styles.image} source={photo.uri} contentFit="contain" />
      </Link.AppleZoomTarget>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  image: {
    flex: 1,
  },
});
