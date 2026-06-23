# Expo SDK 56 Demo 👋

A small showcase app for **Expo SDK 56**, built to demonstrate rendering **truly native
UI from React** — real SwiftUI on iOS and Jetpack Compose (Material 3) on Android — using
the [`@expo/ui`](https://docs.expo.dev/versions/v56.0.0/sdk/ui/) package together with
Expo Router.

Every screen ships an iOS variant, an Android variant, and a web/fallback variant from a
single route, so you can see the same idea expressed in each platform's native toolkit.

## What it demonstrates

- **`@expo/ui` native components** — `List` / `Form` / `Section`, `TextField`, `Toggle`,
  `DatePicker`, `Picker` (menu & segmented), `Button`, and SwiftUI Charts, composed with
  SwiftUI/Compose layout primitives (`VStack`, `HStack`, `ZStack`, `Spacer`).
- **SwiftUI modifiers from JS** — styling via `@expo/ui/swift-ui/modifiers`
  (`frame`, `padding`, `background`, `font`, `foregroundStyle`, `listStyle`, …).
- **Liquid glass** — `expo-glass-effect` / the `glassEffect` modifier on the custom
  New Event header buttons.
- **SF Symbols** — `expo-symbols` for system iconography on iOS.
- **System colors** — `PlatformColor(...)` (`systemGroupedBackground`, `systemRed`, …) so
  the UI matches the OS in light and dark mode automatically.
- **Expo Router** — a native `Stack`, an iOS `formSheet` presentation with a custom glass
  header, large titles, and **typed routes**.
- **React Compiler** — enabled via `app.json` experiments.
- **Reanimated 4 + Worklets** — a keyframe-driven animated splash/logo overlay.

### The three demo screens

| Screen | Native features shown |
| --- | --- |
| **Settings** | Grouped `Form`, profile row, `Toggle`, link rows |
| **New Event** | `formSheet` with a custom liquid-glass header, `TextField`, `DatePicker`, menu/segmented `Picker` |
| **Health Summary** | SwiftUI Charts (line/point/bar), pinned cards, system-colored gradients |

## Get started

This project uses **bun** and **custom native code**, so it must run in a **development
build** (not Expo Go).

1. Install dependencies

   ```bash
   bun install
   ```

2. Run a native build

   ```bash
   bun run ios       # iOS simulator / device
   bun run android   # Android emulator / device
   bun run web       # web (shows fallback UI where native is unavailable)
   ```

## Project structure

Routes are thin re-exports; the real UI lives in platform-split screen files.

```
src/
  app/                 # Expo Router routes (re-export screens)
  screens/             # *.ios.tsx (SwiftUI) · *.android.tsx (Compose) · *.tsx (fallback)
                       # *.data.ts — shared, platform-agnostic data
                       # plus screen-specific components (new-event-header, web-badge)
  components/          # shared UI grouped by role: themed/ · list/ · splash/
  constants/theme.ts   # Colors / Spacing tokens
  styles.ts            # SwiftUI-only style helpers (iOS)
```

For example, the route `src/app/health/summary.tsx` simply does:

```ts
export { default } from '@/screens/health-summary';
```

…and Metro picks `health-summary.ios.tsx`, `health-summary.android.tsx`, or
`health-summary.tsx` per platform.

## Lint

```bash
bun run lint
```

## Learn more

- [Expo SDK 56 documentation](https://docs.expo.dev/versions/v56.0.0/)
- [`@expo/ui`](https://docs.expo.dev/versions/v56.0.0/sdk/ui/)
- [Expo Router](https://docs.expo.dev/router/introduction/)

The `@expo/ui` + Expo Router native UI patterns here are inspired by Tomek Chayen's
["iOS in Expo" showcase](https://github.com/tchayen/ios-in-expo).
