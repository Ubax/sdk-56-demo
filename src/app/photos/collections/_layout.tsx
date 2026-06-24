import { Stack } from 'expo-router/stack';

export default function CollectionsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Collections', headerLargeTitle: true }} />
    </Stack>
  );
}
