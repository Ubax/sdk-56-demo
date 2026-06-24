import AppTabs from '@/components/app-tabs';

// Web has no native tab bar to hide, so the visibility provider is unnecessary.
export default function PhotosLayout() {
  return <AppTabs />;
}
