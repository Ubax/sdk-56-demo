export type PhotoGridProps = {
  selecting: boolean;
  selected: Set<number>;
  onToggle: (id: number) => void;
  onLongPress?: (id: number) => void;
};
