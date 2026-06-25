import { Asset } from 'expo-asset';
import { File } from 'expo-file-system';
import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import { widgetsDirectory } from 'expo-widgets';
import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed/themed-text';
import { ThemedView } from '@/components/themed/themed-view';
import { Spacing } from '@/constants/theme';
import DeliveryActivity, { type DeliveryProps } from '@/widgets/DeliveryActivity';
import SdkWidget from '@/widgets/SdkWidget';
import { SDKS } from '@/widgets/sdk-widget.data';
import { Stack } from 'expo-router';

// The widget needs local file URIs, so each SDK cover is the bundled asset
// resolved to its path in the shared container.
type SdkEntry = { version: number; releaseDate: string; coverUri: string };

// Fake delivery stages the Live Activity steps through automatically. One stage
// advances every ADVANCE_MS: Preparing -> +5 min On the way -> +5 min Delivered.
const STAGES: DeliveryProps['status'][] = ['Preparing', 'On the way', 'Delivered'];
const ADVANCE_MS = 5 * 60 * 1000;
// The widget counts down to the arrival time and fills its progress bar across
// this window on its own. Derive it from ADVANCE_MS so the countdown always hits
// 0 exactly when the final stage lands — reaching "Delivered" takes one advance
// per transition (STAGES.length - 1).
const ETA_MS = ADVANCE_MS * (STAGES.length - 1);
// How long to leave the finished "Delivered" state on screen before dismissing.
const DELIVERED_LINGER_MS = 3 * 1000;

// Widgets run in a separate process, so any image the widget renders has to
// live in the shared app group container (`widgetsDirectory`) where the widget
// can read it.
async function ensureImageInSharedStorage(fileName: string, assetModule: number): Promise<string> {
  const file = new File(widgetsDirectory, fileName);
  if (!file.exists) {
    const asset = await Asset.fromModule(assetModule).downloadAsync();
    await new File(asset.localUri!).copy(file);
  }
  return file.uri;
}

export default function WidgetDemoScreen() {
  const [sdks, setSdks] = useState<SdkEntry[]>();
  // Versions shown in the widget. Seeded from the widget's current timeline on
  // mount (see effect below), falling back to all.
  const [selectedVersions, setSelectedVersions] = useState<Set<number>>(
    () => new Set(SDKS.map((sdk) => sdk.version)),
  );
  const [logoUri, setLogoUri] = useState<string>();
  const [deliveryRunning, setDeliveryRunning] = useState(false);
  const activityRef = useRef<ReturnType<typeof DeliveryActivity.start> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // The widget only shows the selected SDKs, navigated by its own prev/next
  // arrows, so push just those entries (index reset to the start).
  const pushWidget = (entries: SdkEntry[], versions: Set<number>) => {
    const visible = entries.filter((entry) => versions.has(entry.version));
    SdkWidget.updateSnapshot({ sdks: visible, index: 0 });
  };

  useEffect(() => {
    // Copy the logo (for the Live Activity) and every SDK cover into the shared
    // widget container, then push the initial widget snapshot.
    Promise.all([
      ensureImageInSharedStorage('logo.png', require('@/assets/images/logo.png')),
      ...SDKS.map((sdk) => ensureImageInSharedStorage(sdk.coverFile, sdk.coverModule)),
    ])
      .then(async ([logo, ...coverUris]) => {
        setLogoUri(logo);
        const entries: SdkEntry[] = SDKS.map((sdk, i) => ({
          version: sdk.version,
          releaseDate: sdk.releaseDate,
          coverUri: coverUris[i],
        }));
        setSdks(entries);

        // Adopt the selection the widget is already showing (the SDKs in its
        // current timeline entry). Only fall back to all — and push that
        // snapshot — when the widget has nothing yet.
        const timeline = await SdkWidget.getTimeline().catch(() => []);
        const shown = (timeline.at(-1)?.props?.sdks ?? [])
          .map((sdk) => sdk.version)
          .filter((version) => SDKS.some((sdk) => sdk.version === version));

        if (shown.length > 0) {
          setSelectedVersions(new Set(shown));
        } else {
          const all = new Set(SDKS.map((sdk) => sdk.version));
          setSelectedVersions(all);
          pushWidget(entries, all);
        }
      })
      .catch((e) => console.warn('Could not prepare SDK widget images', e));
  }, []);

  const toggleSdk = (version: number) => {
    const next = new Set(selectedVersions);
    if (next.has(version)) {
      // Keep at least one selected so the widget never goes blank.
      if (next.size === 1) return;
      next.delete(version);
    } else {
      next.add(version);
    }
    setSelectedVersions(next);
    if (sdks) {
      pushWidget(sdks, next);
    }
  };

  const propsForStage = (
    stage: number,
    startEpochMs: number,
    etaEpochMs: number,
  ): DeliveryProps => ({
    orderId: '1234',
    status: STAGES[stage],
    stage,
    startEpochMs,
    etaEpochMs,
    logoUri,
  });

  const startDelivery = () => {
    if (!logoUri || deliveryRunning) return; // need the shared logo first
    try {
      // Fixed start/arrival times for the whole run: the widget counts the ETA
      // down and fills the progress bar across this window on its own.
      const startEpochMs = Date.now();
      const etaEpochMs = startEpochMs + ETA_MS;
      activityRef.current = DeliveryActivity.start(propsForStage(0, startEpochMs, etaEpochMs));
      setDeliveryRunning(true);
      let stage = 0;
      intervalRef.current = setInterval(() => {
        stage += 1;
        // Advance via update() — including the final 'Delivered' stage, since
        // end()'s content argument isn't reliably rendered on its own.
        activityRef.current?.update(propsForStage(stage, startEpochMs, etaEpochMs));
        if (stage >= STAGES.length - 1) {
          // 'Delivered' is now showing. Stop advancing and dismiss after a short
          // linger so the finished state stays on screen briefly.
          if (intervalRef.current) clearInterval(intervalRef.current);
          intervalRef.current = null;
          setDeliveryRunning(false);
          setTimeout(() => {
            activityRef.current?.end('default');
            activityRef.current = null;
          }, DELIVERED_LINGER_MS);
        }
      }, ADVANCE_MS);
    } catch (e) {
      // Live Activities require iOS 16.2+ and the user to have them enabled.
      console.warn('Could not start Live Activity', e);
    }
  };

  // Cleanup on unmount: stop the timer and end any running activity.
  useEffect(
    () => () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      activityRef.current?.end('immediate');
    },
    [],
  );

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.scrollContent}
    >
      <Stack.Title>Widgets</Stack.Title>
      <View style={styles.sdkGrid}>
        {SDKS.map((sdk) => {
          const selected = selectedVersions.has(sdk.version);
          return (
            <Pressable
              key={sdk.version}
              onPress={() => toggleSdk(sdk.version)}
              disabled={!sdks}
              style={({ pressed }) => [
                styles.sdkTile,
                pressed && styles.pressed,
                !sdks && styles.disabled,
              ]}
            >
              <Image
                source={sdk.coverModule}
                style={[styles.sdkCover, !selected && styles.sdkCoverDeselected]}
                contentFit="cover"
              />
              {selected && (
                <SymbolView
                  name="checkmark.circle.fill"
                  size={26}
                  type="palette"
                  colors={['#FFFFFF', '#007AFF']}
                  style={styles.checkmark}
                />
              )}
              <ThemedText type="smallBold" style={styles.sdkLabel}>
                SDK {sdk.version}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
      <ThemedText type="small" themeColor="textSecondary" style={styles.hint}>
        Add the SDK Widget to your home screen, then tap SDKs here to choose which appear in it. On
        the medium widget, use the on-widget arrows to switch between the selected SDKs.
      </ThemedText>

      <ActionButton
        title={deliveryRunning ? 'Delivery in progress…' : 'Start delivery Live Activity'}
        onPress={startDelivery}
        disabled={deliveryRunning || !logoUri}
      />
      <ThemedText type="small" themeColor="textSecondary" style={styles.hint}>
        Starts a Live Activity that auto-advances through the delivery stages on the Lock Screen and
        Dynamic Island, then dismisses itself.
      </ThemedText>
    </ScrollView>
  );
}

function ActionButton({
  title,
  onPress,
  disabled,
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [pressed && styles.pressed, disabled && styles.disabled]}
    >
      <ThemedView type="backgroundElement" style={styles.button}>
        <ThemedText type="smallBold">{title}</ThemedText>
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    flexGrow: 1,
    paddingHorizontal: Spacing.four,
    // justifyContent: 'center',
  },
  heading: {
    textAlign: 'center',
  },
  sdkGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    justifyContent: 'center',
    padding: Spacing.two,
  },
  sdkTile: {
    alignItems: 'center',
    gap: Spacing.one,
    width: 96,
  },
  sdkCover: {
    aspectRatio: 1,
    borderRadius: Spacing.three,
    width: '100%',
  },
  sdkCoverDeselected: {
    opacity: 0.4,
  },
  checkmark: {
    position: 'absolute',
    right: 6,
    top: 6,
  },
  sdkLabel: {
    textAlign: 'center',
  },
  button: {
    alignItems: 'center',
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
  },
  hint: {
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
  disabled: {
    opacity: 0.4,
  },
});
