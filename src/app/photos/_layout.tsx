import AppTabs from '@/components/photos/app-tabs';
import { TabBarVisibilityProvider } from '@/components/photos/tab-bar-visibility';

// The Photos sub-app: a native tab bar (Library / Collections / Search) nested
// under the /photos route of the demo. Mirrors the standalone expo-live-stream
// app, with its root Stack handled by the demo's own root layout.
export default function PhotosLayout() {
  return (
    <TabBarVisibilityProvider>
      <AppTabs />
    </TabBarVisibilityProvider>
  );
}
