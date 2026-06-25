import { Button, HStack, Image, Spacer, ZStack } from '@expo/ui/swift-ui';
import {
  aspectRatio,
  clipShape,
  clipped,
  containerBackground,
  controlSize,
  frame,
  labelStyle,
  padding,
  resizable,
  tint,
  widgetURL,
  zIndex,
} from '@expo/ui/swift-ui/modifiers';
import { createWidget, type WidgetEnvironment } from 'expo-widgets';

type SdkWidgetProps = {
  // The full SDK list lives in props so the prev/next buttons can navigate it
  // entirely inside the widget process (they only return a new `index`).
  sdks: { version: number; releaseDate: string; coverUri?: string }[];
  index: number;
};

// Set via the widget's long-press configuration. Matches the app.json parameter.
type SdkConfiguration = { showButtons: boolean };

const SdkWidget = (props: SdkWidgetProps, environment: WidgetEnvironment<SdkConfiguration>) => {
  'widget';
  // Guard against the placeholder render, where WidgetKit passes empty props
  // (the generated entry has `props: nil`). Without this, indexing would throw
  // and the widget would show a red error box.
  const sdks = Array.isArray(props.sdks) ? props.sdks : [];
  const index = props.index ?? 0;
  const current = sdks[index] ?? sdks[0] ?? { version: 0, releaseDate: '', coverUri: undefined };
  // Only show the full-color cover in fullColor mode (or if undefined).
  const isFullColor =
    environment.widgetRenderingMode == null || environment.widgetRenderingMode === 'fullColor';
  const isMedium = environment.widgetFamily === 'systemMedium';
  // Show the nav arrows on medium unless the user turned them off (default on).
  const showButtons = environment.configuration?.showButtons ?? true;

  // onPress runs in the widget process and returns the new props to merge (`sdks`
  // is preserved by the shallow merge), so the buttons work with the app closed.
  const navButton = (direction: 'prev' | 'next') => {
    const disabled = direction === 'prev' ? index === 0 : index === sdks.length - 1;
    if (disabled) {
      return null;
    }
    return (
      <Button
        systemImage={direction === 'prev' ? 'chevron.left' : 'chevron.right'}
        target={direction}
        label={direction}
        modifiers={[tint('#ffffff'), labelStyle('iconOnly'), controlSize('large')]}
        onPress={() => ({
          index: index + (direction === 'prev' ? -1 : 1),
        })}
      />
    );
  };

  return (
    <ZStack
      modifiers={[
        containerBackground('#000000', 'widget'),
        clipShape('containerRelativeShape'),
        // Absolute path (triple slash) so it opens the /widget-demo route;
        // `sdk56demo://widget-demo` would parse `widget-demo` as the host.
        widgetURL('sdk56demo:///widget-demo'),
      ]}
    >
      {/* Full-bleed cover image. */}
      {isFullColor && current.coverUri && (
        <Image
          uiImage={current.coverUri}
          modifiers={[
            resizable(),
            aspectRatio({ contentMode: 'fill' }),
            frame({ maxWidth: Infinity, maxHeight: Infinity }),
            clipped(),
            zIndex(0),
          ]}
        />
      )}

      {/* Medium-only: left/right buttons overlaid at the edges, vertically centered. */}
      {isMedium && showButtons && (
        <HStack
          modifiers={[
            frame({ maxWidth: Infinity, maxHeight: Infinity }),
            padding({ horizontal: 12 }),
            zIndex(3),
          ]}
        >
          {navButton('prev')}
          <Spacer />
          {navButton('next')}
        </HStack>
      )}
    </ZStack>
  );
};

export default createWidget<SdkWidgetProps, SdkConfiguration>('SdkWidget', SdkWidget);
