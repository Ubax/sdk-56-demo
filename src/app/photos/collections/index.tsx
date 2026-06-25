import { Image } from "expo-image";
import { Stack } from "expo-router";
import { SymbolView, type AndroidSymbol, type SFSymbol } from "expo-symbols";
import type { ReactNode } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useToolbarIcons } from "@/lib/use-toolbar-icons";

const BLUE = "#007AFF";

// A recreation of the iOS Photos "Collections" tab: Memories / Pinned / Albums /
// People & Pets sections over a scroll view, with the account + overflow header
// buttons. The data is static placeholder content.
export default function CollectionsScreen() {
  const theme = useTheme();
  const icons = useToolbarIcons();

  return (
    <>
      <Stack.Title large>Collections</Stack.Title>

      {process.env.EXPO_OS !== "web" && (
        <Stack.Toolbar placement="right">
          <Stack.Toolbar.Menu icon={icons.more} title="More">
            <Stack.Toolbar.MenuAction icon="plus" onPress={() => {}}>
              New Album
            </Stack.Toolbar.MenuAction>
            <Stack.Toolbar.MenuAction icon="arrow.up.arrow.down" onPress={() => {}}>
              Sort
            </Stack.Toolbar.MenuAction>
          </Stack.Toolbar.Menu>
          <Stack.Toolbar.Button icon={icons.person} onPress={() => {}} />
        </Stack.Toolbar>
      )}

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.content}
      >
        <Section title="Memories">
          <EmptyCard
            icon={{ ios: "play.circle", android: "play_circle" }}
            title="No Memories Available"
            subtitle="Memories will appear here when more photos and videos are added to the library."
          />
        </Section>

        <Section
          title="Pinned"
          leadingArrow
          trailing={<Pill label="Edit" onPress={() => {}} />}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.pinnedRow}
          >
            <PinnedCard label="Favorites" icon={{ ios: "heart.fill", android: "favorite" }} />
            <PinnedCard label="Recently Saved" imageSeed="lavender-field" />
            <PinnedCard label="Map" />
            <PinnedCard label="Trips" />
          </ScrollView>
        </Section>

        <Section title="Albums">
          <EmptyCard
            icon={{ ios: "folder", android: "folder" }}
            title="No Albums Available"
            subtitle="Albums will appear here when they are added to the library, or synced with iCloud."
            action={<Pill label="Create" onPress={() => {}} />}
          />
        </Section>

        <Section title="People & Pets">
          <Text style={[styles.placeholder, { color: theme.textSecondary }]}>
            People and pets you tag will appear here.
          </Text>
        </Section>
      </ScrollView>
    </>
  );
}

// --- building blocks -------------------------------------------------------

type IconName = { ios: SFSymbol; android: AndroidSymbol };

function Icon({ name, size, color }: { name: IconName; size: number; color: string }) {
  return (
    <SymbolView
      name={{ ios: name.ios, android: name.android, web: name.android }}
      size={size}
      tintColor={color}
    />
  );
}

function Section({
  title,
  leadingArrow,
  trailing,
  children,
}: {
  title: string;
  leadingArrow?: boolean;
  trailing?: ReactNode;
  children: ReactNode;
}) {
  const theme = useTheme();
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>{title}</Text>
          {leadingArrow && (
            <Icon
              name={{ ios: "chevron.right", android: "chevron_right" }}
              size={18}
              color={theme.textSecondary}
            />
          )}
        </View>
        <View style={styles.sectionAccessories}>
          {trailing}
          <Icon
            name={{ ios: "chevron.down", android: "expand_more" }}
            size={20}
            color={theme.textSecondary}
          />
        </View>
      </View>
      {children}
    </View>
  );
}

function EmptyCard({
  icon,
  title,
  subtitle,
  action,
}: {
  icon: IconName;
  title: string;
  subtitle: string;
  action?: ReactNode;
}) {
  const theme = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: theme.backgroundElement }]}>
      <View style={styles.cardTopRow}>
        <Icon name={icon} size={26} color={theme.textSecondary} />
        {action}
      </View>
      <View>
        <Text style={[styles.cardTitle, { color: theme.text }]}>{title}</Text>
        <Text style={[styles.cardSubtitle, { color: theme.textSecondary }]}>{subtitle}</Text>
      </View>
    </View>
  );
}

function Pill({ label, onPress }: { label: string; onPress: () => void }) {
  const theme = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.pill,
        { backgroundColor: theme.backgroundSelected },
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.pillText, { color: BLUE }]}>{label}</Text>
    </Pressable>
  );
}

function PinnedCard({
  label,
  icon,
  imageSeed,
}: {
  label: string;
  icon?: IconName;
  imageSeed?: string;
}) {
  return (
    <View style={styles.pinnedCard}>
      {imageSeed ? (
        <Image
          style={StyleSheet.absoluteFill}
          source={`https://picsum.photos/seed/${imageSeed}/300/300`}
          contentFit="cover"
          transition={150}
        />
      ) : (
        <View style={[StyleSheet.absoluteFill, styles.pinnedPlaceholder]} />
      )}
      {icon && (
        <View style={styles.pinnedIcon}>
          <Icon name={icon} size={20} color="#FFFFFF" />
        </View>
      )}
      <Text style={styles.pinnedLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: Spacing.six,
  },
  section: {
    paddingTop: Spacing.four,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.two,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
  },
  sectionAccessories: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
  },
  card: {
    marginHorizontal: Spacing.four,
    borderRadius: Spacing.three,
    padding: Spacing.three,
    minHeight: 132,
    justifyContent: "space-between",
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  cardSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  pinnedRow: {
    paddingHorizontal: Spacing.four,
    gap: Spacing.three,
  },
  pinnedCard: {
    width: 130,
    height: 130,
    borderRadius: Spacing.three,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  pinnedPlaceholder: {
    backgroundColor: "#AEB3BB",
  },
  pinnedIcon: {
    position: "absolute",
    top: Spacing.two,
    right: Spacing.two,
  },
  pinnedLabel: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
    margin: Spacing.two,
    textShadowColor: "rgba(0,0,0,0.35)",
    textShadowRadius: 3,
  },
  pill: {
    paddingVertical: Spacing.one,
    paddingHorizontal: Spacing.three,
    borderRadius: Spacing.four,
  },
  pillText: {
    fontSize: 15,
    fontWeight: "600",
  },
  pressed: {
    opacity: 0.6,
  },
  placeholder: {
    paddingHorizontal: Spacing.four,
    fontSize: 14,
  },
});
