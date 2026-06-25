import AppTabs from "@/components/photos/app-tabs";
import { TabBarVisibilityProvider } from "@/components/photos/tab-bar-visibility";

export default function PhotosLayout() {
  return (
    <TabBarVisibilityProvider>
      <AppTabs />
    </TabBarVisibilityProvider>
  );
}
