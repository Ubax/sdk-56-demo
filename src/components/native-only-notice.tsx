import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

// These screens render native SwiftUI / Jetpack Compose via @expo/ui, which has
// no web renderer for the platform-specific trees. Shown as the web fallback.
export function NativeOnlyNotice({ title }: { title: string }) {
  return (
    <View style={styles.container}>
      <ThemedText type="subtitle">{title}</ThemedText>
      <ThemedText type="small" themeColor="textSecondary" style={styles.text}>
        This screen renders native SwiftUI on iOS and Jetpack Compose on Android.{'\n'}
        Open it on a device or simulator to see it.
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    gap: Spacing.three,
    justifyContent: 'center',
    padding: Spacing.four,
  },
  text: {
    textAlign: 'center',
  },
});
