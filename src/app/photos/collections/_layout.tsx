import { Stack } from "expo-router";

import { useTheme } from "@/hooks/use-theme";

export default function CollectionsLayout() {
  const theme = useTheme();
  return <Stack screenOptions={{ contentStyle: { backgroundColor: theme.background } }} />;
}
