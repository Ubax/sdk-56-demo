import { Spacing } from "@/constants/theme";
import type { SFSymbol } from "expo-symbols";
import type { ImageSourcePropType } from "react-native";

import checkCircle from "@expo/material-symbols/check_circle.xml";
import checklist from "@expo/material-symbols/checklist.xml";
import closeIcon from "@expo/material-symbols/close.xml";
import deleteIcon from "@expo/material-symbols/delete.xml";
import favorite from "@expo/material-symbols/favorite.xml";
import filterList from "@expo/material-symbols/filter_list.xml";
import infoIcon from "@expo/material-symbols/info.xml";
import moreHoriz from "@expo/material-symbols/more_horiz.xml";
import photo from "@expo/material-symbols/photo.xml";
import shareIcon from "@expo/material-symbols/share.xml";
import tune from "@expo/material-symbols/tune.xml";
import videocam from "@expo/material-symbols/videocam.xml";

export const toolbarSpacerWidth =
  process.env.EXPO_OS === "android" ? Spacing.two : undefined;

export type ToolbarIcon = SFSymbol | ImageSourcePropType | undefined;

// iOS uses SF Symbol names; Android uses the imported XML assets.
const SYMBOLS = {
  filter: { ios: "line.3.horizontal.decrease", android: filterList },
  more: { ios: "ellipsis", android: moreHoriz },
  close: { ios: "xmark", android: closeIcon },
  select: { ios: undefined, android: checklist },
  selectAll: { ios: "checkmark.circle", android: checkCircle },
  share: { ios: "square.and.arrow.up", android: shareIcon },
  trash: { ios: "trash", android: deleteIcon },
  heart: { ios: "heart", android: favorite },
  info: { ios: "info.circle", android: infoIcon },
  adjust: { ios: "slider.horizontal.3", android: tune },
  allPhotos: { ios: "photo", android: photo },
  videos: { ios: "video", android: videocam },
} satisfies Record<string, { ios?: SFSymbol; android: ImageSourcePropType }>;

type ToolbarIcons = Record<keyof typeof SYMBOLS, ToolbarIcon>;

const ICONS = Object.fromEntries(
  Object.entries(SYMBOLS).map(([key, { ios, android }]) => [
    key,
    process.env.EXPO_OS === "android" ? android : ios,
  ])
) as ToolbarIcons;

export function useToolbarIcons(): ToolbarIcons {
  return ICONS;
}
