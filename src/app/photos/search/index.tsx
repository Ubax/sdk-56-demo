import { Stack } from "expo-router";
import { ScrollView, StyleSheet, Text } from "react-native";

export default function SearchScreen() {
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content}>
      <Stack.Title large>Search</Stack.Title>
      <Text style={styles.text}>Search</Text>
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
