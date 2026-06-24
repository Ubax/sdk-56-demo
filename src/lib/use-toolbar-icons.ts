import { Spacing } from "@/constants/theme";
import type { SFSymbol } from "expo-symbols";
import type { ImageSourcePropType } from "react-native";

// Android Material Symbols as XML vector drawables, imported as Metro assets and
// rendered natively by the toolbar's Compose Icon. They resolve synchronously,
// so a button has a valid icon on first render — unlike runtime rasterization,
// which resolves late and leaves bottom-toolbar buttons blank. iOS uses SF Symbols.
import checklist from "@expo/material-symbols/checklist.xml";
import closeIcon from "@expo/material-symbols/close.xml";
import deleteIcon from "@expo/material-symbols/delete.xml";
import favorite from "@expo/material-symbols/favorite.xml";
import filterList from "@expo/material-symbols/filter_list.xml";
import infoIcon from "@expo/material-symbols/info.xml";
import moreHoriz from "@expo/material-symbols/more_horiz.xml";
import shareIcon from "@expo/material-symbols/share.xml";
import tune from "@expo/material-symbols/tune.xml";

// Bottom-toolbar spacers: flexible on iOS (full-width bar), a small fixed gap on
// Android (compact floating toolbar, where width-less spacers collapse to null).
export const toolbarSpacerWidth =
  process.env.EXPO_OS === "android" ? Spacing.two : undefined;

export type ToolbarIcon = SFSymbol | ImageSourcePropType | undefined;

// iOS uses SF Symbol names; Android uses the imported XML assets.
const SYMBOLS = {
  filter: { ios: "line.3.horizontal.decrease", android: filterList },
  more: { ios: "ellipsis", android: moreHoriz },
  close: { ios: "xmark", android: closeIcon },
  // iOS shows a plain text "Select" button (no icon); Android needs an icon.
  select: { ios: undefined, android: checklist },
  share: { ios: "square.and.arrow.up", android: shareIcon },
  trash: { ios: "trash", android: deleteIcon },
  heart: { ios: "heart", android: favorite },
  info: { ios: "info.circle", android: infoIcon },
  adjust: { ios: "slider.horizontal.3", android: tune },
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
