import { Stack } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed/themed-text";

export default function CollectionsScreen() {
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content}>
      <Stack.Title large>Collections</Stack.Title>
      <ThemedText style={styles.text}>Collection</ThemedText>
    </ScrollView>
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
