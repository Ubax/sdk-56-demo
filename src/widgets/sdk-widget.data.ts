// Placeholder SDK data for the SDK widget. Imported by the demo screen only —
// the widget layout is serialized in isolation and can't reference module-scope
// values, so this is passed to the widget as props. Cover images are bundled
// assets; the screen copies them into the shared widget container at runtime.
export type SdkInfo = {
  version: number;
  releaseDate: string;
  // File name used as the key in the shared widget container.
  coverFile: string;
  // require() of the bundled cover asset.
  coverModule: number;
};

// Release dates and covers come from the Expo changelog (https://expo.dev/changelog);
// see sdks/README.md for the per-SDK blog post links. Ordered oldest -> newest.
export const SDKS: SdkInfo[] = [
  { version: 50, releaseDate: 'January 18, 2024', coverFile: 'sdk-50.jpg', coverModule: require('@/assets/images/sdk-50.jpg') },
  { version: 51, releaseDate: 'May 7, 2024', coverFile: 'sdk-51.jpg', coverModule: require('@/assets/images/sdk-51.jpg') },
  { version: 52, releaseDate: 'November 12, 2024', coverFile: 'sdk-52.jpg', coverModule: require('@/assets/images/sdk-52.jpg') },
  { version: 53, releaseDate: 'April 30, 2025', coverFile: 'sdk-53.jpg', coverModule: require('@/assets/images/sdk-53.jpg') },
  { version: 54, releaseDate: 'September 10, 2025', coverFile: 'sdk-54.jpg', coverModule: require('@/assets/images/sdk-54.jpg') },
  { version: 55, releaseDate: 'February 25, 2026', coverFile: 'sdk-55.jpg', coverModule: require('@/assets/images/sdk-55.jpg') },
  { version: 56, releaseDate: 'May 21, 2026', coverFile: 'sdk-56.jpg', coverModule: require('@/assets/images/sdk-56.jpg') },
];
