import { Stack } from "expo-router";
import { useEffect, useState } from "react";

import { IOSTransparentHeader } from "@/components/photos/ios-transparent-header";
import { LibraryToolbar } from "@/components/photos/library-toolbar";
import { PhotoGrid } from "@/components/photos/photo-grid";
import { ShareSheet } from "@/components/photos/share-sheet";
import { useTabBarHidden } from "@/components/photos/tab-bar-visibility";
import { PHOTOS } from "@/lib/photos";

const isAndroid = process.env.EXPO_OS === "android";
const isIOS = process.env.EXPO_OS === "ios";

export default function LibraryScreen() {
  const [selecting, setSelecting] = useState(false);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [sharing, setSharing] = useState(false);

  const selectedCount = selected.size;

  // Android: select mode is driven by long-press and ends when the selection
  // empties (or via the header X). iOS keeps an empty select mode open.
  useEffect(() => {
    if (isAndroid && selecting && selectedCount === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing select mode to an emptied selection
      setSelecting(false);
    }
  }, [selecting, selectedCount]);

  // Hide the native tab bar in iOS select mode so the bottom toolbar owns the
  // bottom edge (the only way out of select mode is the header X). Android keeps
  // its tab bar — select actions live in the header there.
  const { setHidden } = useTabBarHidden();
  useEffect(() => {
    setHidden(isIOS && selecting);
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
    setSharing(false);
  }

  return (
    <>
      <IOSTransparentHeader />
      <Stack.Title>{""}</Stack.Title>

      <LibraryToolbar
        selecting={selecting}
        selectedCount={selectedCount}
        onStartSelect={() => setSelecting(true)}
        onExitSelect={exitSelection}
        onSelectAll={() => setSelected(new Set(PHOTOS.map((p) => p.id)))}
        onShare={() => setSharing(true)}
      />

      <PhotoGrid
        selecting={selecting}
        selected={selected}
        onToggle={toggle}
        onLongPress={isAndroid ? startSelection : undefined}
      />

      <ShareSheet
        photoIds={[...selected]}
        isPresented={sharing}
        onDismiss={() => setSharing(false)}
      />
    </>
  );
}
