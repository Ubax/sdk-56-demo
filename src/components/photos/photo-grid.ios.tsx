import { FlatList } from "react-native";

import { PhotoCell } from "@/components/photos/photo-cell";
import { PHOTOS } from "@/lib/photos";

import type { PhotoGridProps } from "./photo-grid.types";

// iOS grid: `contentInsetAdjustmentBehavior="automatic"` insets the content below
// the transparent large-title header so the first row isn't clipped while the
// rest of the grid still scrolls underneath it.
export function PhotoGrid({ selecting, selected, onToggle, onLongPress }: PhotoGridProps) {
  return (
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
          onToggle={onToggle}
          onLongPress={onLongPress}
        />
      )}
    />
  );
}
