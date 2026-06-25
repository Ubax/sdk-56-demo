import { Image } from "expo-image";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { PlatformColor, StyleSheet, View } from "react-native";

import { IOSTransparentHeader } from "@/components/photos/ios-transparent-header";
import { useHideTabBar } from "@/components/photos/tab-bar-visibility";
import { useTheme } from "@/hooks/use-theme";
import { usePhoto } from "@/lib/photos";
import { toolbarSpacerWidth, useToolbarIcons } from "@/lib/use-toolbar-icons";

const isIOS = process.env.EXPO_OS === "ios";

export default function PhotoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const photo = usePhoto(id);
  const theme = useTheme();

  useHideTabBar({ ios: true });

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <IOSTransparentHeader />
      <Stack.Title style={isIOS ? { color: PlatformColor("label") } : undefined}>
        2 Sep 2025
      </Stack.Title>
      <Stack.Screen.BackButton displayMode="minimal" />

      <PhotoDetailToolbar />

      <Link.AppleZoomTarget>
        <Image style={styles.image} source={photo.uri} contentFit="contain" />
      </Link.AppleZoomTarget>
    </View>
  );
}

function PhotoDetailToolbar() {
  const icons = useToolbarIcons();
  if (process.env.EXPO_OS !== "ios") return null;

  return (
    <>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Menu icon={icons.more} title="More">
          <Stack.Toolbar.MenuAction icon="square.and.arrow.up" onPress={() => {}}>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
  },
});
