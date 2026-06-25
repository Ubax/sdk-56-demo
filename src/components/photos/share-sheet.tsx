import { BottomSheet, Column, Icon, Row, ScrollView, Spacer, Text, RNHostView } from '@expo/ui';
import { Image } from 'react-native';

import { PHOTOS } from '@/lib/photos';

export type ShareSheetProps = {
  // Photos being shared; drives the title count and the preview/thumbnail.
  photoIds: number[];
  isPresented: boolean;
  onDismiss: () => void;
};

const GRAY = '#8E8E93';
const CIRCLE_BG = '#E9E9EB';

const sel = Icon.select;

// Icons: SF Symbols on iOS, Material Symbols (require'd XML assets) on Android.
const ICONS = {
  location: sel({ ios: 'location.fill', android: require('@expo/material-symbols/near_me.xml') }),
  chevron: sel({
    ios: 'chevron.right',
    android: require('@expo/material-symbols/chevron_right.xml'),
  }),
  close: sel({ ios: 'xmark', android: require('@expo/material-symbols/close.xml') }),
  reminders: sel({
    ios: 'list.bullet',
    android: require('@expo/material-symbols/format_list_bulleted.xml'),
  }),
  more: sel({ ios: 'ellipsis', android: require('@expo/material-symbols/more_horiz.xml') }),
};

const ACTIONS = [
  {
    id: 'copy',
    label: 'Copy Photos',
    icon: sel({ ios: 'doc.on.doc', android: require('@expo/material-symbols/content_copy.xml') }),
  },
  {
    id: 'album',
    label: 'Add to Album',
    icon: sel({
      ios: 'rectangle.stack.badge.plus',
      android: require('@expo/material-symbols/library_add.xml'),
    }),
  },
  {
    id: 'wallpaper',
    label: 'Create Photo Shuffle Wallpaper',
    icon: sel({ ios: 'photo.stack', android: require('@expo/material-symbols/wallpaper.xml') }),
  },
  {
    id: 'export',
    label: 'Export Unmodified Originals',
    icon: sel({ ios: 'folder', android: require('@expo/material-symbols/folder.xml') }),
  },
];

const photoUri = (id: number) => PHOTOS[id - 1]?.uri ?? PHOTOS[0].uri;

// Remote image hosted inside the SwiftUI sheet via RNHostView.
function HostedImage({
  uri,
  size,
  radius,
}: {
  uri: string;
  size: { width: number; height: number };
  radius: number;
}) {
  return (
    <RNHostView matchContents>
      <Image source={{ uri }} style={{ ...size, borderRadius: radius }} />
    </RNHostView>
  );
}

// Round, gray-backed icon tile used by the action grid.
function CircleIcon({ icon, diameter = 60 }: { icon: ShareIcon; diameter?: number }) {
  return (
    <Column
      alignment="center"
      style={{
        width: diameter,
        height: diameter,
        borderRadius: diameter / 2,
        backgroundColor: CIRCLE_BG,
      }}
    >
      <Spacer flexible />
      <Icon name={icon} size={26} color="#1C1C1E" />
      <Spacer flexible />
    </Column>
  );
}

type ShareIcon = (typeof ACTIONS)[number]['icon'];

export function ShareSheet({ photoIds, isPresented, onDismiss }: ShareSheetProps) {
  const count = photoIds.length;
  const firstId = photoIds[0] ?? 1;

  return (
    <BottomSheet isPresented={isPresented} onDismiss={onDismiss} snapPoints={['half', 'full']}>
      <ScrollView>
        <Column spacing={20} style={{ paddingBottom: 24 }}>
          {/* Header: thumbnail + title/subtitle + close */}
          <Row spacing={12} alignment="center">
            <HostedImage uri={photoUri(firstId)} size={{ width: 56, height: 56 }} radius={12} />
            <Column spacing={2}>
              <Text textStyle={{ fontSize: 18, fontWeight: '700' }}>
                {`${count} ${count === 1 ? 'Photo' : 'Photos'} Selected`}
              </Text>
              <Row spacing={4} alignment="center">
                <Icon name={ICONS.location} size={11} color={GRAY} />
                <Text textStyle={{ fontSize: 14, color: GRAY }}>Locations Are Included</Text>
              </Row>
            </Column>
            <Spacer flexible />
            <Column
              alignment="center"
              onPress={onDismiss}
              style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: CIRCLE_BG }}
            >
              <Spacer flexible />
              <Icon name={ICONS.close} size={14} color={GRAY} />
              <Spacer flexible />
            </Column>
          </Row>

          {/* Options disclosure */}
          <Row spacing={4} alignment="center" onPress={onDismiss}>
            <Text textStyle={{ fontSize: 16, fontWeight: '600' }}>Options</Text>
            <Icon name={ICONS.chevron} size={12} color={GRAY} />
          </Row>

          {/* Selected photos preview */}
          <ScrollView direction="horizontal" showsIndicators={false}>
            <Row spacing={10}>
              {photoIds.map((id) => (
                <HostedImage
                  key={id}
                  uri={photoUri(id)}
                  size={{ width: 280, height: 200 }}
                  radius={14}
                />
              ))}
            </Row>
          </ScrollView>

          {/* App targets */}
          <Row spacing={20}>
            <Column alignment="center" spacing={6} style={{ width: 76 }} onPress={onDismiss}>
              <CircleIcon icon={ICONS.reminders} />
              <Text textStyle={{ fontSize: 12, textAlign: 'center' }}>Reminders</Text>
            </Column>
            <Column alignment="center" spacing={6} style={{ width: 76 }} onPress={onDismiss}>
              <CircleIcon icon={ICONS.more} />
              <Text textStyle={{ fontSize: 12, textAlign: 'center' }}>More</Text>
            </Column>
          </Row>

          {/* Action grid */}
          <Row spacing={12}>
            {ACTIONS.map((action) => (
              <Column
                key={action.id}
                alignment="center"
                spacing={6}
                style={{ width: 78 }}
                onPress={onDismiss}
              >
                <CircleIcon icon={action.icon} />
                <Text numberOfLines={3} textStyle={{ fontSize: 12, textAlign: 'center' }}>
                  {action.label}
                </Text>
              </Column>
            ))}
          </Row>
        </Column>
      </ScrollView>
    </BottomSheet>
  );
}
