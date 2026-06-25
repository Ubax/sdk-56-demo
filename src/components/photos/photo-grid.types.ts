// Shared props for the platform variants of the photo grid (`.tsx` / `.ios.tsx`).
export type PhotoGridProps = {
  selecting: boolean;
  selected: Set<number>;
  onToggle: (id: number) => void;
  // Android only: long-press enters select mode. Undefined on iOS, where
  // long-press opens the cell's native peek/context menu instead.
  onLongPress?: (id: number) => void;
};
