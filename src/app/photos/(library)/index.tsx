import { Stack } from "expo-router";
import { useEffect, useState } from "react";

import { LibraryToolbar } from "@/components/photos/library-toolbar";
import { PhotoGrid } from "@/components/photos/photo-grid";
import { useTabBarHidden } from "@/components/photos/tab-bar-visibility";
import { PHOTOS } from "@/lib/photos";

const isAndroid = process.env.EXPO_OS === "android";

export default function LibraryScreen() {
  const [selecting, setSelecting] = useState(false);
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const selectedCount = selected.size;

  // Android: select mode is driven by long-press and ends when the selection
  // empties (or via the header X). iOS keeps an empty select mode open.
  useEffect(() => {
    if (isAndroid && selecting && selectedCount === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing select mode to an emptied selection
      setSelecting(false);
    }
  }, [selecting, selectedCount]);

  // Hide the native tab bar in select mode so the bottom toolbar owns the
  // bottom edge (the only way out of select mode is the header X).
  const { setHidden } = useTabBarHidden();
  useEffect(() => {
    setHidden(selecting);
    return () => setHidden(false);
  }, [selecting, setHidden]);

  function toggle(id: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  // Android long-press: enter select mode, keeping any existing selection.
  function startSelection(id: number) {
    setSelecting(true);
    setSelected((prev) => new Set(prev).add(id));
  }

  function exitSelection() {
    setSelecting(false);
    setSelected(new Set());
  }

  return (
    <>
      {/* iOS: transparent large-title header the grid scrolls under. Android
          uses the navigation theme's default opaque app bar. */}
      {process.env.EXPO_OS === "ios" && (
        <Stack.Header
          transparent
          blurEffect="none"
          style={{ backgroundColor: "transparent", shadowColor: "transparent" }}
          largeStyle={{ backgroundColor: "transparent", shadowColor: "transparent" }}
        />
      )}
      {/* The visible "Library" heading is the left toolbar item, so the native
          title stays empty. */}
      <Stack.Title>{""}</Stack.Title>

      <LibraryToolbar
        selecting={selecting}
        selectedCount={selectedCount}
        onStartSelect={() => setSelecting(true)}
        onExitSelect={exitSelection}
        onSelectAll={() => setSelected(new Set(PHOTOS.map((p) => p.id)))}
      />

      <PhotoGrid
        selecting={selecting}
        selected={selected}
        onToggle={toggle}
        onLongPress={isAndroid ? startSelection : undefined}
      />
    </>
  );
}
