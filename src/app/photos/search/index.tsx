import { Stack } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";

import { useTheme } from "@/hooks/use-theme";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const theme = useTheme();

  return (
    <>
      <Stack.Title large>Search</Stack.Title>
      {/* Native search field in the header (iOS shows it under the large title). */}
      <Stack.SearchBar
        placeholder="Photos, People, Places"
        onChangeText={(e) => setQuery(e.nativeEvent.text)}
      />

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.content}
      >
        <Text style={[styles.text, { color: theme.textSecondary }]}>
          {query ? `Results for “${query}”` : "Search your photos"}
        </Text>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  text: {
    fontSize: 20,
  },
});
