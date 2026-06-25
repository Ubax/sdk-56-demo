import { FlatList } from "react-native";

import { PhotoCell } from "@/components/photos/photo-cell";
import { PHOTOS } from "@/lib/photos";

import type { PhotoGridProps } from "./photo-grid.types";

// Base grid (Android / web). The iOS variant (`.ios.tsx`) adds the content inset
// so the grid scrolls under the transparent large-title header.
export function PhotoGrid({ selecting, selected, onToggle, onLongPress }: PhotoGridProps) {
  return (
    <FlatList
      data={PHOTOS}
      keyExtractor={(photo) => String(photo.id)}
      numColumns={3}
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
