// Shared photo dataset for the library grid and the [id] detail screen.
// Each photo's source is requested at a different size so aspect-ratio handling
// can be exercised across shapes — but the display sizes are measured from the
// loaded image (`onLoad`), never read back from here.

import { useMemo } from "react";

export type Photo = { id: number; uri: string };

// Varied request sizes, cycled across the photos (only used to build the URLs).
const SIZES: readonly (readonly [number, number])[] = [
  [1200, 1600], // 3:4 portrait
  [1600, 1200], // 4:3 landscape
  [1200, 1200], // square
  [1080, 1920], // 9:16 tall
  [1920, 1080], // 16:9 wide
  [1200, 1500], // 4:5 portrait
];

export const PHOTOS: Photo[] = Array.from({ length: 30 }, (_, i) => {
  const [width, height] = SIZES[i % SIZES.length];
  return { id: i + 1, uri: `https://picsum.photos/seed/${i + 1}/${width}/${height}` };
});

// Look up a photo by its route id. A hook (not a plain getter) so the lookup can
// later be backed by a store or query without touching call sites.
export function usePhoto(id: string | number): Photo {
  return useMemo(() => PHOTOS[Number(id) - 1] ?? PHOTOS[0], [id]);
}

// Square thumbnail crop of the same underlying image (same seed) for the grid.
export const thumbUri = (id: number) =>
  `https://picsum.photos/seed/${id}/300/300`;
