export type LibraryToolbarProps = {
  selecting: boolean;
  selectedCount: number;
  // Open select mode (iOS "Select" button; Android enters it by long-press).
  onStartSelect: () => void;
  // Leave select mode and clear the selection (header X).
  onExitSelect: () => void;
  // Select every photo ("Select All" in the overflow menu).
  onSelectAll: () => void;
  // Open the share sheet (iOS bottom toolbar share button).
  onShare: () => void;
};
