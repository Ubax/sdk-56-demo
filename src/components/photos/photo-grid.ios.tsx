import { FlatList } from "react-native";

import { PhotoCell } from "@/components/photos/photo-cell";
import { PHOTOS } from "@/lib/photos";

import type { PhotoGridProps } from "./photo-grid.types";

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
