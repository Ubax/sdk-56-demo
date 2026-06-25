import { Link } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed/themed-text';
import { ThemedView } from '@/components/themed/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// Fixed brand accents (the theme palette is grayscale only). They read well in
// both light and dark mode against the themed card backgrounds.
const Accent = '#208AEF';
const Danger = '#E5484D';
const Success = '#30A46C';

export default function ServerScreen() {
  const theme = useTheme();
  const [loggedIn, setLoggedIn] = useState(false);
  const [busy, setBusy] = useState<'login' | 'fetch' | null>(null);
  const [value, setValue] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function login() {
    setBusy('login');
    setError(null);
    try {
      const res = await fetch('/api/login', { method: 'POST', credentials: 'include' });
      if (!res.ok) throw new Error(`Login failed (HTTP ${res.status})`);
      setLoggedIn(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Login failed');
    } finally {
      setBusy(null);
    }
  }

  async function fetchData() {
    setBusy('fetch');
    setError(null);
    try {
      const res = await fetch('/api/data', { credentials: 'include' });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error ?? `HTTP ${res.status}`);
      setValue(body.value);
    } catch (e) {
      setValue(null);
      setError(e instanceof Error ? e.message : 'Request failed');
    } finally {
      setBusy(null);
    }
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <SafeAreaView edges={['bottom']} style={styles.safeArea}>
          <ThemedText type="small" themeColor="textSecondary">
            A round-trip through Expo Router&apos;s server: an API route sets an auth cookie, server
            middleware guards a second route, and a data loader reads a server-only secret.
          </ThemedText>

          {/* Authentication */}
          <Card>
            <View style={styles.cardHead}>
              <ThemedText type="smallBold">Authentication</ThemedText>
              <Badge
                label={loggedIn ? 'Logged in' : 'Logged out'}
                color={loggedIn ? Success : theme.textSecondary}
              />
            </View>
            <ThemedText type="small" themeColor="textSecondary">
              Calls <Code>POST /api/login</Code>, which responds with{' '}
              <Code>Set-Cookie: token=1234</Code>.
            </ThemedText>
            <Button
              title="Login"
              onPress={login}
              loading={busy === 'login'}
              disabled={busy !== null}
            />
          </Card>

          {/* Protected data */}
          <Card>
            <ThemedText type="smallBold">Protected data</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              Calls <Code>GET /api/data</Code>. Middleware returns <Code>401</Code> until the cookie
              is present — try it before logging in.
            </ThemedText>
            <Button
              title="Fetch data"
              variant="secondary"
              onPress={fetchData}
              loading={busy === 'fetch'}
              disabled={busy !== null}
            />
            {value !== null && (
              <View style={styles.result}>
                <ThemedText type="small" themeColor="textSecondary">
                  Random number from the server
                </ThemedText>
                <ThemedText style={[styles.bigNumber, { color: Accent }]}>{value}</ThemedText>
              </View>
            )}
            {error && (
              <ThemedText type="smallBold" style={{ color: Danger }}>
                {error}
              </ThemedText>
            )}
          </Card>

          {/* Link to the data-loader page */}
          <Link href="/secret" asChild>
            <Pressable style={({ pressed }) => pressed && styles.pressed}>
              <ThemedView type="backgroundElement" style={styles.linkRow}>
                <View style={styles.rowText}>
                  <ThemedText type="smallBold">Secret Loader</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    Server data loader reading an env secret
                  </ThemedText>
                </View>
                <ThemedText type="small" style={{ color: theme.textSecondary }}>
                  ›
                </ThemedText>
              </ThemedView>
            </Pressable>
          </Link>
        </SafeAreaView>
      </ScrollView>
    </ThemedView>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <ThemedView type="backgroundElement" style={styles.card}>
      {children}
    </ThemedView>
  );
}

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <View style={[styles.badge, { backgroundColor: color + '22' }]}>
      <ThemedText type="small" style={{ color, fontWeight: '700' }}>
        {label}
      </ThemedText>
    </View>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <ThemedText type="code" themeColor="textSecondary">
      {children}
    </ThemedText>
  );
}

function Button({
  title,
  onPress,
  loading,
  disabled,
  variant = 'primary',
}: {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
}) {
  const theme = useTheme();
  const isPrimary = variant === 'primary';
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        isPrimary
          ? { backgroundColor: Accent }
          : { borderWidth: 1, borderColor: theme.backgroundSelected },
        (pressed || disabled) && styles.buttonPressed,
      ]}>
      {loading ? (
        <ActivityIndicator color={isPrimary ? '#fff' : theme.text} />
      ) : (
        <ThemedText type="smallBold" style={{ color: isPrimary ? '#fff' : theme.text }}>
          {title}
        </ThemedText>
      )}
    </Pressable>
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
  card: {
    borderRadius: Spacing.three,
    gap: Spacing.three,
    padding: Spacing.three,
  },
  cardHead: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  badge: {
    borderRadius: Spacing.four,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.half,
  },
  button: {
    alignItems: 'center',
    borderRadius: Spacing.three,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: Spacing.three,
  },
  buttonPressed: {
    opacity: 0.6,
  },
  result: {
    alignItems: 'center',
    gap: Spacing.one,
    paddingVertical: Spacing.two,
  },
  bigNumber: {
    fontSize: 44,
    fontWeight: '700',
    lineHeight: 50,
  },
  linkRow: {
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
  pressed: {
    opacity: 0.7,
  },
});
