import { useFocusEffect } from 'expo-router';
import { createContext, use, useCallback, useMemo, useState, type PropsWithChildren } from 'react';

type TabBarVisibility = {
  hidden: boolean;
  setHidden: (hidden: boolean) => void;
};

const TabBarVisibilityContext = createContext<TabBarVisibility>({
  hidden: false,
  setHidden: () => {},
});

export function TabBarVisibilityProvider({ children }: PropsWithChildren) {
  const [hidden, setHidden] = useState(false);
  const value = useMemo(() => ({ hidden, setHidden }), [hidden]);
  return <TabBarVisibilityContext value={value}>{children}</TabBarVisibilityContext>;
}

type PlatformFlags = { ios?: boolean; android?: boolean; web?: boolean };

export function useTabBarHidden() {
  return use(TabBarVisibilityContext);
}

/**
 * Hide the native tab bar while the calling screen is focused; restore on blur.
 * `platforms` limits this to the listed platforms (default: none), so e.g. only
 * iOS hides the bar while Android keeps it visible.
 */
export function useHideTabBar(platforms: PlatformFlags = {}) {
  const { setHidden } = use(TabBarVisibilityContext);
  const active = platforms[process.env.EXPO_OS as keyof PlatformFlags] ?? false;
  useFocusEffect(
    useCallback(() => {
      if (!active) return;
      setHidden(true);
      return () => setHidden(false);
    }, [active, setHidden])
  );
}
