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

/** Access tab-bar visibility: the tab bar reads `hidden`; screens call `setHidden` to toggle it. */
export function useTabBarHidden() {
  return use(TabBarVisibilityContext);
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
