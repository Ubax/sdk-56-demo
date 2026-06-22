import {
  Button,
  Form,
  Host,
  HStack,
  Image,
  Section,
  Spacer,
  Text,
  Toggle,
  VStack,
} from '@expo/ui/swift-ui';
import { buttonStyle, font } from '@expo/ui/swift-ui/modifiers';
import { useState } from 'react';
import { PlatformColor } from 'react-native';

import { Chevron } from '@/components/chevron';
import { LinkRow } from '@/components/link-row';
import { secondaryText } from '@/styles';

const noop = () => {};

export default function SettingsScreen() {
  const [airplaneMode, setAirplaneMode] = useState(false);

  return (
    <Host style={{ flex: 1 }}>
      <Form>
        <Section>
          <Button modifiers={[buttonStyle('plain')]} onPress={noop}>
            <HStack spacing={12}>
              <Image
                systemName="person.crop.circle.fill"
                size={60}
                color={PlatformColor('systemGray3')}
              />
              <VStack alignment="leading" spacing={2}>
                <Text modifiers={[font({ size: 21, weight: 'semibold' })]}>Edward Expo</Text>
                <Text modifiers={[font({ size: 13 }), secondaryText]}>
                  Apple Account, iCloud+, and more
                </Text>
              </VStack>
              <Spacer />
              <Chevron />
            </HStack>
          </Button>

          <LinkRow title="Apple Arcade Free for 3 Months" onPress={noop} />
        </Section>

        <Section>
          <Toggle isOn={airplaneMode} onIsOnChange={setAirplaneMode} label="Airplane Mode" />
          <LinkRow title="Personal Hotspot" onPress={noop} />
        </Section>
      </Form>
    </Host>
  );
}
