import { useFocusEffect } from 'expo-router';
import { createContext, use, useCallback, useMemo, useState, type PropsWithChildren } from 'react';

type TabBarVisibility = {
  hidden: boolean;
  setHidden: (hidden: boolean) => void;
};

// Default is a no-op so screens calling useHideTabBar() on web (no provider) don't crash.
const TabBarVisibilityContext = createContext<TabBarVisibility>({
  hidden: false,
  setHidden: () => {},
});

export function TabBarVisibilityProvider({ children }: PropsWithChildren) {
  const [hidden, setHidden] = useState(false);
  const value = useMemo(() => ({ hidden, setHidden }), [hidden]);
  return <TabBarVisibilityContext value={value}>{children}</TabBarVisibilityContext>;
}

// Which platforms honor tab-bar hiding. Omitted platforms always report visible.
type PlatformFlags = { ios?: boolean; android?: boolean; web?: boolean };

/**
 * Access tab-bar visibility: the tab bar reads `hidden`; screens call `setHidden`
 * to toggle it. `platforms` gates `hidden` to the listed platforms (default: all),
 * so e.g. only iOS hides the bar while Android keeps it visible.
 */
export function useTabBarHidden(platforms: PlatformFlags = { ios: true, android: true, web: true }) {
  const { hidden, setHidden } = use(TabBarVisibilityContext);
  const os = process.env.EXPO_OS as keyof PlatformFlags;
  return { hidden: (platforms[os] ?? false) && hidden, setHidden };
}

/** Hide the native tab bar while the calling screen is focused; restore on blur. */
export function useHideTabBar() {
  const { setHidden } = use(TabBarVisibilityContext);
  useFocusEffect(
    useCallback(() => {
      setHidden(true);
      return () => setHidden(false);
    }, [setHidden])
  );
}
