import {
  Card,
  Column,
  HorizontalDivider,
  Host,
  Icon,
  type MaterialColors,
  Row,
  Spacer,
  Switch,
  Text,
  useMaterialColors,
} from '@expo/ui/jetpack-compose';
import {
  background,
  clickable,
  fillMaxSize,
  fillMaxWidth,
  padding,
  verticalScroll,
  weight,
} from '@expo/ui/jetpack-compose/modifiers';
import { useState } from 'react';

const ACCOUNT_ICON = require('@/assets/icons/account_circle.xml');
const CHEVRON_ICON = require('@/assets/icons/chevron_right.xml');

const noop = () => {};

// Android counterpart of the SwiftUI Settings screen: Material 3 grouped cards
// instead of Form/Section, Switch instead of Toggle, useMaterialColors instead
// of PlatformColor.
export default function SettingsScreen() {
  const colors = useMaterialColors();
  const [airplaneMode, setAirplaneMode] = useState(false);

  return (
    <Host style={{ flex: 1 }}>
      <Column
        modifiers={[
          fillMaxSize(),
          background(colors.background),
          verticalScroll(),
          padding(16, 16, 16, 16),
        ]}
        verticalArrangement={{ spacedBy: 16 }}>
        <Group colors={colors}>
          <Row
            modifiers={[fillMaxWidth(), clickable(noop), padding(16, 14, 16, 14)]}
            verticalAlignment="center"
            horizontalArrangement={{ spacedBy: 14 }}>
            <Icon source={ACCOUNT_ICON} size={56} tint={colors.onSurfaceVariant} />
            <Column modifiers={[weight(1)]} verticalArrangement={{ spacedBy: 2 }}>
              <Text style={{ typography: 'titleMedium' }} color={colors.onSurface}>
                Edward Expo
              </Text>
              <Text style={{ typography: 'bodySmall' }} color={colors.onSurfaceVariant}>
                Apple Account, iCloud+, and more
              </Text>
            </Column>
            <Icon source={CHEVRON_ICON} size={22} tint={colors.onSurfaceVariant} />
          </Row>
          <HorizontalDivider color={colors.outlineVariant} />
          <NavRow colors={colors} title="Apple Arcade Free for 3 Months" />
        </Group>

        <Group colors={colors}>
          <Row
            modifiers={[fillMaxWidth(), padding(16, 6, 16, 6)]}
            verticalAlignment="center">
            <Text style={{ typography: 'bodyLarge' }} color={colors.onSurface}>
              Airplane Mode
            </Text>
            <Spacer modifiers={[weight(1)]} />
            <Switch value={airplaneMode} onCheckedChange={setAirplaneMode} />
          </Row>
          <HorizontalDivider color={colors.outlineVariant} />
          <NavRow colors={colors} title="Personal Hotspot" />
        </Group>
      </Column>
    </Host>
  );
}

// A rounded Material card that visually groups rows, like a grouped table section.
function Group({ children, colors }: { children: React.ReactNode; colors: MaterialColors }) {
  return (
    <Card colors={{ containerColor: colors.surfaceContainer }} modifiers={[fillMaxWidth()]}>
      <Column modifiers={[fillMaxWidth()]}>{children}</Column>
    </Card>
  );
}

function NavRow({ colors, title }: { colors: MaterialColors; title: string }) {
  return (
    <Row
      modifiers={[fillMaxWidth(), clickable(noop), padding(16, 16, 16, 16)]}
      verticalAlignment="center">
      <Text style={{ typography: 'bodyLarge' }} color={colors.onSurface}>
        {title}
      </Text>
      <Spacer modifiers={[weight(1)]} />
      <Icon source={CHEVRON_ICON} size={22} tint={colors.onSurfaceVariant} />
    </Row>
  );
}
