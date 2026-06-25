import { useLoaderData } from 'expo-router';
import { createStaticLoader } from 'expo-server';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed/themed-text';
import { ThemedView } from '@/components/themed/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';

const Accent = '#208AEF';

// Runs on the server. `SECRET_VALUE` has no EXPO_PUBLIC_ prefix, so it never
// enters the client bundle — only the returned value is serialized to the page.
export const loader = createStaticLoader(async () => {
  return { secret: process.env.SECRET_VALUE ?? '(SECRET_VALUE not set)' };
});

export default function SecretScreen() {
  const { secret } = useLoaderData<typeof loader>();

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <SafeAreaView edges={['bottom']} style={styles.safeArea}>
          <ThemedView type="backgroundElement" style={styles.hero}>
            <ThemedText type="small" themeColor="textSecondary">
              Loaded server-side via data loader
            </ThemedText>
            <View style={styles.secretBox}>
              <ThemedText type="code" style={[styles.secretText, { color: Accent }]}>
                {secret}
              </ThemedText>
            </View>
          </ThemedView>

          <ThemedText type="small" themeColor="textSecondary" style={styles.caption}>
            This route exports a <ThemedText type="code">loader</ThemedText> that reads{' '}
            <ThemedText type="code">process.env.SECRET_VALUE</ThemedText> on the server. The
            component reads the result with <ThemedText type="code">useLoaderData()</ThemedText>.
            The secret itself never ships in the client JavaScript bundle.
          </ThemedText>
        </SafeAreaView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
  },
  safeArea: {
    alignSelf: 'stretch',
    gap: Spacing.three,
    maxWidth: MaxContentWidth,
    padding: Spacing.four,
    width: '100%',
  },
  hero: {
    alignItems: 'center',
    borderRadius: Spacing.four,
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.five,
  },
  secretBox: {
    alignItems: 'center',
  },
  secretText: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  caption: {
    paddingHorizontal: Spacing.one,
  },
});
