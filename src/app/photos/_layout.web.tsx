import AppTabs from '@/components/photos/app-tabs';

// Web has no native tab bar to hide, so the visibility provider is unnecessary.
export default function PhotosLayout() {
  return <AppTabs />;
}
