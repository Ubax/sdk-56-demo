import { Host, Icon, List, ListItem } from "@expo/ui";
import { Stack } from "expo-router";

import { useToolbarIcons } from "@/lib/use-toolbar-icons";

const chevron = Icon.select({
  ios: "chevron.right",
  android: import("@expo/material-symbols/chevron_right.xml"),
});

const COLLECTIONS = [
  {
    id: "favorites",
    title: "Favorites",
    count: "24 Photos",
    icon: Icon.select({
      ios: "heart.fill",
      android: import("@expo/material-symbols/favorite.xml"),
    }),
  },
  {
    id: "recents",
    title: "Recently Saved",
    count: "108 Items",
    icon: Icon.select({
      ios: "clock.fill",
      android: import("@expo/material-symbols/schedule.xml"),
    }),
  },
  {
    id: "videos",
    title: "Videos",
    count: "32 Videos",
    icon: Icon.select({
      ios: "video.fill",
      android: import("@expo/material-symbols/videocam.xml"),
    }),
  },
  {
    id: "map",
    title: "Map",
    count: "Places",
    icon: Icon.select({
      ios: "map.fill",
      android: import("@expo/material-symbols/map.xml"),
    }),
  },
  {
    id: "albums",
    title: "Albums",
    count: "12 Albums",
    icon: Icon.select({
      ios: "folder.fill",
      android: import("@expo/material-symbols/folder.xml"),
    }),
  },
  {
    id: "people",
    title: "People & Pets",
    count: "8 People",
    icon: Icon.select({
      ios: "person.crop.circle.fill",
      android: import("@expo/material-symbols/account_circle.xml"),
    }),
  },
];

export default function CollectionsScreen() {
  const icons = useToolbarIcons();

  return (
    <>
      <Stack.Title large>Collections</Stack.Title>

      {process.env.EXPO_OS !== "web" && (
        <Stack.Toolbar placement="right">
          <Stack.Toolbar.Menu icon={icons.more} title="More">
            <Stack.Toolbar.MenuAction icon="plus" onPress={() => {}}>
              New Album
            </Stack.Toolbar.MenuAction>
            <Stack.Toolbar.MenuAction icon="arrow.up.arrow.down" onPress={() => {}}>
              Sort
            </Stack.Toolbar.MenuAction>
          </Stack.Toolbar.Menu>
          <Stack.Toolbar.Button icon={icons.person} onPress={() => {}} />
        </Stack.Toolbar>
      )}

      <Host style={{ flex: 1 }}>
        <List>
          {COLLECTIONS.map((c) => (
            <ListItem
              key={c.id}
              onPress={() => {}}
              leading={<Icon name={c.icon} size={22} />}
              trailing={<Icon name={chevron} size={14} />}
              supportingText={c.count}
            >
              {c.title}
            </ListItem>
          ))}
        </List>
      </Host>
    </>
  );
}
