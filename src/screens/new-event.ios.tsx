import {
  Button,
  DatePicker,
  Host,
  HStack,
  Image,
  List,
  Picker,
  Section,
  Spacer,
  Text,
  TextField,
  Toggle,
} from '@expo/ui/swift-ui';
import {
  buttonStyle,
  datePickerStyle,
  listRowInsets,
  listSectionMargins,
  listStyle,
  padding,
  pickerStyle,
  tag,
} from '@expo/ui/swift-ui/modifiers';
import { useState } from 'react';
import { PlatformColor } from 'react-native';

import { LinkRow } from '@/components/link-row';
import { NEW_EVENT_HEADER_HEIGHT } from '@/components/new-event-header';
import {
  ALERT_OPTIONS,
  ONE_HOUR_IN_MS,
  REPEAT_OPTIONS,
  TRAVEL_TIME_OPTIONS,
} from '@/screens/new-event.data';
import { menuTint, secondaryText } from '@/styles';

const noop = () => {};

// Trim the row toward the classic grouped-table height and inset the cards
// further from the edges (iOS 26+); `listSectionMargins` only applies per-section.
const SECTION_MODS = [
  listRowInsets({ bottom: 7, leading: 16, top: 7, trailing: 16 }),
  listSectionMargins({ edges: 'horizontal', length: 22 }),
];

function MenuChevron() {
  return (
    <Image systemName="chevron.up.chevron.down" size={12} color={PlatformColor('systemGray')} />
  );
}

export default function NewEventScreen() {
  const [allDay, setAllDay] = useState(false);
  const now = new Date();
  const [startsAt, setStartsAt] = useState(now);
  const [endsAt, setEndsAt] = useState(new Date(now.getTime() + ONE_HOUR_IN_MS));
  const [travelTime, setTravelTime] = useState(TRAVEL_TIME_OPTIONS[0]);
  const [repeat, setRepeat] = useState(REPEAT_OPTIONS[0]);
  const [alert, setAlert] = useState(ALERT_OPTIONS[0]);

  const dateComponents = allDay ? (['date'] as const) : (['date', 'hourAndMinute'] as const);

  return (
    <Host style={{ backgroundColor: 'transparent', flex: 1 }}>
      <List modifiers={[listStyle('insetGrouped'), padding({ top: NEW_EVENT_HEADER_HEIGHT })]}>
        <Section modifiers={SECTION_MODS}>
          <TextField placeholder="Title" />
          <TextField placeholder="Location or Video Call" />
        </Section>

        <Section modifiers={SECTION_MODS}>
          <Toggle isOn={allDay} onIsOnChange={setAllDay} label="All-day" />
          <DatePicker
            title="Starts"
            displayedComponents={[...dateComponents]}
            selection={startsAt}
            onDateChange={setStartsAt}
            modifiers={[datePickerStyle('compact')]}
          />
          <DatePicker
            title="Ends"
            displayedComponents={[...dateComponents]}
            selection={endsAt}
            onDateChange={setEndsAt}
            modifiers={[datePickerStyle('compact')]}
          />
          <Picker
            label="Travel Time"
            selection={travelTime}
            onSelectionChange={setTravelTime}
            modifiers={[pickerStyle('menu'), menuTint]}>
            {TRAVEL_TIME_OPTIONS.map((option) => (
              <Text key={option} modifiers={[tag(option)]}>
                {option}
              </Text>
            ))}
          </Picker>
        </Section>

        <Section modifiers={SECTION_MODS}>
          <Picker
            label="Repeat"
            selection={repeat}
            onSelectionChange={setRepeat}
            modifiers={[pickerStyle('menu'), menuTint]}>
            {REPEAT_OPTIONS.map((option) => (
              <Text key={option} modifiers={[tag(option)]}>
                {option}
              </Text>
            ))}
          </Picker>
        </Section>

        <Section modifiers={SECTION_MODS}>
          <Button modifiers={[buttonStyle('plain')]} onPress={noop}>
            <HStack spacing={8}>
              <Text>Calendar</Text>
              <Spacer />
              <Image systemName="circle.fill" size={10} color={PlatformColor('systemBlue')} />
              <Text modifiers={[secondaryText]}>Dom</Text>
              <MenuChevron />
            </HStack>
          </Button>
          <LinkRow title="Invitees" value="None" onPress={noop} />
        </Section>

        <Section modifiers={SECTION_MODS}>
          <Picker
            label="Alert"
            selection={alert}
            onSelectionChange={setAlert}
            modifiers={[pickerStyle('menu'), menuTint]}>
            {ALERT_OPTIONS.map((option) => (
              <Text key={option} modifiers={[tag(option)]}>
                {option}
              </Text>
            ))}
          </Picker>
        </Section>

        <Section modifiers={SECTION_MODS}>
          <Button
            label="Add attachment"
            onPress={noop}
            modifiers={[buttonStyle('plain'), secondaryText]}
          />
        </Section>
      </List>
    </Host>
  );
}
