import { StyleSheet } from "react-native";

import { ThemedText } from "@/components/themed/themed-text";
import { ThemedView } from "@/components/themed/themed-view";

export default function CollectionsScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Collections</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", flex: 1, justifyContent: "center" },
});
