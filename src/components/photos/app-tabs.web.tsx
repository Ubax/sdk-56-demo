import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
  TabTriggerSlotProps,
  TabListProps,
} from 'expo-router/ui';
import { Pressable, Text, useColorScheme, View, StyleSheet } from 'react-native';

import { Colors, Fonts, MaxContentWidth, Spacing } from '@/constants/theme';

export default function AppTabs() {
  return (
    <Tabs>
      <TabSlot style={{ height: '100%' }} />
      <TabList asChild>
        <CustomTabList>
          <TabTrigger name="library" href="/photos" asChild>
            <TabButton>Library</TabButton>
          </TabTrigger>
          <TabTrigger name="collections" href="/photos/collections" asChild>
            <TabButton>Collections</TabButton>
          </TabTrigger>
          <TabTrigger name="search" href="/photos/search" asChild>
            <TabButton>Search</TabButton>
          </TabTrigger>
        </CustomTabList>
      </TabList>
    </Tabs>
  );
}

function useColors() {
  const scheme = useColorScheme();
  return Colors[scheme === 'dark' ? 'dark' : 'light'];
}

export function TabButton({ children, isFocused, ...props }: TabTriggerSlotProps) {
  const colors = useColors();
  return (
    <Pressable {...props} style={({ pressed }) => pressed && styles.pressed}>
      <View
        style={[
          styles.tabButtonView,
          { backgroundColor: isFocused ? colors.backgroundSelected : colors.backgroundElement },
        ]}>
        <Text style={{ color: isFocused ? colors.text : colors.textSecondary, fontFamily: Fonts.sans }}>
          {children}
        </Text>
      </View>
    </Pressable>
  );
}

export function CustomTabList(props: TabListProps) {
  const colors = useColors();

  return (
    <View {...props} style={styles.tabListContainer}>
      <View style={[styles.innerContainer, { backgroundColor: colors.backgroundElement }]}>
        <Text style={[styles.brandText, { color: colors.text, fontFamily: Fonts.sans }]}>Photos</Text>
        {props.children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tabListContainer: {
    position: 'absolute',
    width: '100%',
    padding: Spacing.three,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  innerContainer: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.five,
    borderRadius: Spacing.five,
    flexDirection: 'row',
    alignItems: 'center',
    flexGrow: 1,
    gap: Spacing.two,
    maxWidth: MaxContentWidth,
  },
  brandText: {
    marginRight: 'auto',
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.7,
  },
  tabButtonView: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.three,
  },
});
