import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { SymbolView } from 'expo-symbols';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { thumbUri, usePhoto, type Photo } from '@/lib/photos';
import { useState } from 'react';
import { height } from '@expo/ui/jetpack-compose/modifiers';

type Props = {
  photo: Photo;
  selecting: boolean;
  selected: boolean;
  onToggle: (id: number) => void;
  onLongPress?: (id: number) => void;
};

export function PhotoCell({ photo, selecting, selected, onToggle, onLongPress }: Props) {
  const theme = useTheme();

  // Fire a haptic before the long-press action (Android only — iOS long-press
  // opens the native peek, which has its own haptic).
  const handleLongPress = onLongPress
    ? () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onLongPress(photo.id);
      }
    : undefined;

  const { uri } = usePhoto(photo.id);
  const [size, setSize] = useState({ width: 0, height: 0 });

  return (
    <Link
      href={`/photos/${photo.id}`}
      asChild
      onPress={(e) => {
        if (selecting) {
          e.preventDefault();
          onToggle(photo.id);
        }
      }}
    >
      <Link.Trigger withAppleZoom>
        <Pressable style={styles.cell} onLongPress={handleLongPress}>
          <Image
            style={[styles.image, { backgroundColor: theme.backgroundElement }]}
            source={uri}
            contentFit="cover"
            transition={150}
            onLoad={(e) => setSize(e.source)}
          />
          {selected && <SelectionCheckmark />}
        </Pressable>
      </Link.Trigger>
      <Link.Preview style={{ width: size.width, height: size.height }} />
      <Link.Menu>
        <Link.Menu inline palette>
          <Link.MenuAction icon="square.and.arrow.up" onPress={() => {}}>
            Share
          </Link.MenuAction>
          <Link.MenuAction icon="heart" onPress={() => {}}>
            Favorite
          </Link.MenuAction>
          <Link.MenuAction icon="trash" destructive onPress={() => {}}>
            Delete
          </Link.MenuAction>
        </Link.Menu>
        <Link.MenuAction icon="doc.on.doc" onPress={() => {}}>
          Copy
        </Link.MenuAction>
        <Link.MenuAction icon="plus.square.on.square" onPress={() => {}}>
          Duplicate
        </Link.MenuAction>
        <Link.MenuAction icon="eye.slash" onPress={() => {}}>
          Hide
        </Link.MenuAction>
        <Link.MenuAction icon="rectangle.stack.badge.plus" onPress={() => {}}>
          Add to Album
        </Link.MenuAction>
      </Link.Menu>
    </Link>
  );
}

// iOS draws the two-tone SF Symbol directly. On Android SymbolView renders a
// single-color glyph, so wrap a white check in a blue circle for the same badge.
function SelectionCheckmark() {
  if (process.env.EXPO_OS === 'android') {
    return (
      <View style={[styles.checkmark, styles.androidBadge]}>
        <SymbolView name={{ android: 'check' }} size={18} tintColor="#FFFFFF" />
      </View>
    );
  }
  return (
    <SymbolView
      name="checkmark.circle.fill"
      size={26}
      type="palette"
      colors={['#FFFFFF', '#007AFF']}
      style={styles.checkmark}
    />
  );
}

const styles = StyleSheet.create({
  cell: {
    flex: 1 / 3,
    aspectRatio: 1,
    padding: 1,
  },
  image: {
    flex: 1,
  },
  checkmark: {
    position: 'absolute',
    bottom: 6,
    right: 6,
  },
  androidBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
