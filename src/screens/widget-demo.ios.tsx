import { Asset } from 'expo-asset';
import { File } from 'expo-file-system';
import { widgetsDirectory } from 'expo-widgets';
import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed/themed-text';
import { ThemedView } from '@/components/themed/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import DeliveryActivity, { type DeliveryProps } from '@/widgets/DeliveryActivity';
import SdkWidget from '@/widgets/SdkWidget';
import { SDKS } from '@/widgets/sdk-widget.data';

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
  const [selectedIndex, setSelectedIndex] = useState(SDKS.length - 1); // default to the newest SDK
  const [logoUri, setLogoUri] = useState<string>();
  const [deliveryRunning, setDeliveryRunning] = useState(false);
  const activityRef = useRef<ReturnType<typeof DeliveryActivity.start> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Copy the logo (for the Live Activity) and every SDK cover into the shared
    // widget container, then push the initial widget snapshot.
    Promise.all([
      ensureImageInSharedStorage('logo.png', require('@/assets/images/logo.png')),
      ...SDKS.map((sdk) => ensureImageInSharedStorage(sdk.coverFile, sdk.coverModule)),
    ]).then(([logo, ...coverUris]) => {
      setLogoUri(logo);
      const entries: SdkEntry[] = SDKS.map((sdk, i) => ({
        version: sdk.version,
        releaseDate: sdk.releaseDate,
        coverUri: coverUris[i],
      }));
      setSdks(entries);
      SdkWidget.updateSnapshot({ sdks: entries, index: SDKS.length - 1 });
    }).catch((e) => console.warn('Could not prepare SDK widget images', e));
  }, []);

  const selectSdk = (index: number) => {
    setSelectedIndex(index);
    if (sdks) {
      SdkWidget.updateSnapshot({ sdks, index });
    }
  };

  const propsForStage = (stage: number, startEpochMs: number, etaEpochMs: number): DeliveryProps => ({
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
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <SafeAreaView edges={['bottom']} style={styles.safeArea}>
          <ThemedText type="title" style={styles.heading}>
            Widgets
          </ThemedText>

          <View style={styles.sdkRow}>
            {SDKS.map((sdk, index) => (
              <Pressable
                key={sdk.version}
                onPress={() => selectSdk(index)}
                disabled={!sdks}
                style={({ pressed }) => [styles.sdkChip, pressed && styles.pressed, !sdks && styles.disabled]}>
                <ThemedView
                  type="backgroundElement"
                  style={[styles.sdkChipInner, index === selectedIndex && styles.sdkChipActive]}>
                  <ThemedText type="smallBold">SDK {sdk.version}</ThemedText>
                </ThemedView>
              </Pressable>
            ))}
          </View>
          <ThemedText type="small" themeColor="textSecondary" style={styles.hint}>
            Add the SDK Widget to your home screen, then pick an SDK here to update it. On the
            medium widget, use the on-widget arrows to switch SDKs, or long-press → Edit Widget to
            choose the main text.
          </ThemedText>

          <ActionButton
            title={deliveryRunning ? 'Delivery in progress…' : 'Start delivery Live Activity'}
            onPress={startDelivery}
            disabled={deliveryRunning || !logoUri}
          />
          <ThemedText type="small" themeColor="textSecondary" style={styles.hint}>
            Starts a Live Activity that auto-advances through the delivery stages on the Lock Screen
            and Dynamic Island, then dismisses itself.
          </ThemedText>
        </SafeAreaView>
      </ScrollView>
    </ThemedView>
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
      style={({ pressed }) => [pressed && styles.pressed, disabled && styles.disabled]}>
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
    justifyContent: 'center',
  },
  safeArea: {
    alignSelf: 'center',
    gap: Spacing.three,
    justifyContent: 'center',
    maxWidth: MaxContentWidth,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
    width: '100%',
  },
  heading: {
    textAlign: 'center',
  },
  sdkRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
    justifyContent: 'center',
    paddingVertical: Spacing.two,
  },
  sdkChip: {
    minWidth: 84,
  },
  sdkChipInner: {
    alignItems: 'center',
    borderColor: 'transparent',
    borderRadius: Spacing.three,
    borderWidth: 2,
    paddingVertical: Spacing.three,
  },
  sdkChipActive: {
    borderColor: '#366DF2',
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
