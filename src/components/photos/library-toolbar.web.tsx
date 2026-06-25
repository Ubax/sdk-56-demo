import type { LibraryToolbarProps } from "./library-toolbar.types";

// Web has no native `Stack.Toolbar`, so the Library header toolbar is a no-op.
export function LibraryToolbar(_props: LibraryToolbarProps) {
  return null;
}
