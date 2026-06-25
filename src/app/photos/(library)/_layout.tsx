import { Stack } from 'expo-router';

// Header styling is configured per screen with Stack.Header / Stack.Title /
// Stack.Screen.BackButton, not via raw screenOptions here.
export default function LibraryLayout() {
  return (
    <Stack>
      <Stack.Screen name="[id]" options={{ title: '' }} />
    </Stack>
  );
}
