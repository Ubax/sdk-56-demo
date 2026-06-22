import { Link, type Href } from 'expo-router';
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnimatedIcon } from '@/components/animated-icon';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { WebBadge } from '@/components/web-badge';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type MenuItem = {
  title: string;
  subtitle: string;
  href: Href;
};

// Each screen renders native SwiftUI on iOS and Jetpack Compose (Material 3) on
// Android from the same route — the headline of the Expo UI segment.
const ITEMS: MenuItem[] = [
  { href: '/settings', subtitle: 'Form · Toggle · grouped rows', title: 'Settings' },
  { href: '/new-event', subtitle: 'TextField · DatePicker · Picker (form sheet)', title: 'New Event' },
  { href: '/health/summary', subtitle: 'Charts · cards · native tabs', title: 'Health Summary' },
  // iOS-only: real WidgetKit home screen widget + a delivery Live Activity.
  ...(Platform.OS === 'ios'
    ? [{ href: '/widget-demo', subtitle: 'Home screen widget · Live Activity', title: 'Widgets' } as MenuItem]
    : []),
];

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <SafeAreaView style={styles.safeArea}>
          <ThemedView style={styles.heroSection}>
            <AnimatedIcon />
            <ThemedText type="title" style={styles.title}>
              Welcome to&nbsp;Expo
            </ThemedText>
          </ThemedView>

          <ThemedText type="code" style={styles.code}>
            sdk 56 demos
          </ThemedText>

          <View style={styles.list}>
            {ITEMS.map((item) => (
              <MenuRow key={item.title} item={item} />
            ))}
          </View>

          {Platform.OS === 'web' && <WebBadge />}
        </SafeAreaView>
      </ScrollView>
    </ThemedView>
  );
}

function MenuRow({ item }: { item: MenuItem }) {
  const theme = useTheme();

  return (
    <Link href={item.href} asChild>
      <Pressable style={({ pressed }) => pressed && styles.pressed}>
        <ThemedView type="backgroundElement" style={styles.row}>
          <View style={styles.rowText}>
            <ThemedText type="smallBold">{item.title}</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              {item.subtitle}
            </ThemedText>
          </View>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            ›
          </ThemedText>
        </ThemedView>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  safeArea: {
    alignItems: 'center',
    flex: 1,
    gap: Spacing.three,
    maxWidth: MaxContentWidth,
    paddingBottom: Spacing.four,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.four,
  },
  heroSection: {
    alignItems: 'center',
    gap: Spacing.four,
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.five,
  },
  title: {
    textAlign: 'center',
  },
  code: {
    alignSelf: 'center',
    textTransform: 'uppercase',
  },
  list: {
    alignSelf: 'stretch',
    gap: Spacing.two,
    width: '100%',
  },
  pressed: {
    opacity: 0.7,
  },
  row: {
    alignItems: 'center',
    borderRadius: Spacing.three,
    flexDirection: 'row',
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.three,
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
});
