import {
  Box,
  Card,
  Column,
  DatePickerDialog,
  DropdownMenuItem,
  ExposedDropdownMenu,
  ExposedDropdownMenuBox,
  HorizontalDivider,
  Host,
  Icon,
  type MaterialColors,
  OutlinedTextField,
  Row,
  Spacer,
  Switch,
  Text,
  TextButton,
  useMaterialColors,
} from '@expo/ui/jetpack-compose';
import {
  background,
  clip,
  fillMaxSize,
  fillMaxWidth,
  menuAnchor,
  padding,
  Shapes,
  size,
  verticalScroll,
  weight,
} from '@expo/ui/jetpack-compose/modifiers';
import { useState } from 'react';

import {
  ALERT_OPTIONS,
  ONE_HOUR_IN_MS,
  REPEAT_OPTIONS,
  TRAVEL_TIME_OPTIONS,
} from '@/screens/new-event.data';

const UNFOLD_ICON = require('@/assets/icons/unfold_more.xml');
const CHEVRON_ICON = require('@/assets/icons/chevron_right.xml');

const noop = () => {};

// Android counterpart of the SwiftUI New Event form: Material 3 grouped cards,
// OutlinedTextField, Switch, ExposedDropdownMenuBox menus, and a DatePickerDialog.
export default function NewEventScreen() {
  const colors = useMaterialColors();
  const [allDay, setAllDay] = useState(false);
  const now = new Date();
  const [startsAt, setStartsAt] = useState(now);
  const [endsAt, setEndsAt] = useState(new Date(now.getTime() + ONE_HOUR_IN_MS));
  const [travelTime, setTravelTime] = useState(TRAVEL_TIME_OPTIONS[0]);
  const [repeat, setRepeat] = useState(REPEAT_OPTIONS[0]);
  const [alert, setAlert] = useState(ALERT_OPTIONS[0]);

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
          <Column modifiers={[fillMaxWidth(), padding(12, 12, 12, 12)]} verticalArrangement={{ spacedBy: 12 }}>
            <OutlinedTextField modifiers={[fillMaxWidth()]} singleLine>
              <OutlinedTextField.Label>
                <Text>Title</Text>
              </OutlinedTextField.Label>
            </OutlinedTextField>
            <OutlinedTextField modifiers={[fillMaxWidth()]} singleLine>
              <OutlinedTextField.Label>
                <Text>Location or Video Call</Text>
              </OutlinedTextField.Label>
            </OutlinedTextField>
          </Column>
        </Group>

        <Group colors={colors}>
          <Row modifiers={[fillMaxWidth(), padding(16, 6, 16, 6)]} verticalAlignment="center">
            <Text style={{ typography: 'bodyLarge' }} color={colors.onSurface}>
              All-day
            </Text>
            <Spacer modifiers={[weight(1)]} />
            <Switch value={allDay} onCheckedChange={setAllDay} />
          </Row>
          <HorizontalDivider color={colors.outlineVariant} />
          <DateRow colors={colors} label="Starts" date={startsAt} allDay={allDay} onChange={setStartsAt} />
          <HorizontalDivider color={colors.outlineVariant} />
          <DateRow colors={colors} label="Ends" date={endsAt} allDay={allDay} onChange={setEndsAt} />
          <HorizontalDivider color={colors.outlineVariant} />
          <MenuField
            colors={colors}
            label="Travel Time"
            options={TRAVEL_TIME_OPTIONS}
            selected={travelTime}
            onSelect={setTravelTime}
          />
        </Group>

        <Group colors={colors}>
          <MenuField
            colors={colors}
            label="Repeat"
            options={REPEAT_OPTIONS}
            selected={repeat}
            onSelect={setRepeat}
          />
        </Group>

        <Group colors={colors}>
          <Row
            modifiers={[fillMaxWidth(), padding(16, 16, 16, 16)]}
            verticalAlignment="center"
            horizontalArrangement={{ spacedBy: 8 }}>
            <Text style={{ typography: 'bodyLarge' }} color={colors.onSurface}>
              Calendar
            </Text>
            <Spacer modifiers={[weight(1)]} />
            <Box modifiers={[size(10, 10), clip(Shapes.Circle), background('#0A84FF')]} />
            <Text style={{ typography: 'bodyLarge' }} color={colors.onSurfaceVariant}>
              Dom
            </Text>
            <Icon source={UNFOLD_ICON} size={14} tint={colors.onSurfaceVariant} />
          </Row>
          <HorizontalDivider color={colors.outlineVariant} />
          <Row
            modifiers={[fillMaxWidth(), padding(16, 16, 16, 16)]}
            verticalAlignment="center"
            horizontalArrangement={{ spacedBy: 8 }}>
            <Text style={{ typography: 'bodyLarge' }} color={colors.onSurface}>
              Invitees
            </Text>
            <Spacer modifiers={[weight(1)]} />
            <Text style={{ typography: 'bodyLarge' }} color={colors.onSurfaceVariant}>
              None
            </Text>
            <Icon source={CHEVRON_ICON} size={18} tint={colors.onSurfaceVariant} />
          </Row>
        </Group>

        <Group colors={colors}>
          <MenuField
            colors={colors}
            label="Alert"
            options={ALERT_OPTIONS}
            selected={alert}
            onSelect={setAlert}
          />
        </Group>

        <TextButton onClick={noop} modifiers={[fillMaxWidth()]}>
          <Text color={colors.primary}>Add attachment</Text>
        </TextButton>
      </Column>
    </Host>
  );
}

function Group({ children, colors }: { children: React.ReactNode; colors: MaterialColors }) {
  return (
    <Card colors={{ containerColor: colors.surfaceContainer }} modifiers={[fillMaxWidth()]}>
      <Column modifiers={[fillMaxWidth()]}>{children}</Column>
    </Card>
  );
}

function DateRow({
  allDay,
  colors,
  date,
  label,
  onChange,
}: {
  allDay: boolean;
  colors: MaterialColors;
  date: Date;
  label: string;
  onChange: (date: Date) => void;
}) {
  const [open, setOpen] = useState(false);
  const formatted = allDay
    ? date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
    : date.toLocaleString('en-US', {
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        month: 'short',
      });

  return (
    <>
      <Row
        modifiers={[fillMaxWidth(), padding(16, 14, 16, 14)]}
        verticalAlignment="center">
        <Text style={{ typography: 'bodyLarge' }} color={colors.onSurface}>
          {label}
        </Text>
        <Spacer modifiers={[weight(1)]} />
        <FilledTonalLabel colors={colors} text={formatted} onPress={() => setOpen(true)} />
      </Row>
      {open ? (
        <DatePickerDialog
          initialDate={date.toISOString().slice(0, 10)}
          onDateSelected={(selected) => {
            onChange(selected);
            setOpen(false);
          }}
          onDismissRequest={() => setOpen(false)}
        />
      ) : null}
    </>
  );
}

// A tappable tonal chip that mirrors iOS's compact date field button.
function FilledTonalLabel({
  colors,
  onPress,
  text,
}: {
  colors: MaterialColors;
  onPress: () => void;
  text: string;
}) {
  return (
    <Row
      modifiers={[
        clip(Shapes.RoundedCorner(8)),
        background(colors.secondaryContainer),
        padding(12, 6, 12, 6),
      ]}
      verticalAlignment="center">
      <Text style={{ typography: 'labelLarge' }} color={colors.onSecondaryContainer}>
        {text}
      </Text>
    </Row>
  );
}

function MenuField({
  colors,
  label,
  onSelect,
  options,
  selected,
}: {
  colors: MaterialColors;
  label: string;
  onSelect: (value: string) => void;
  options: string[];
  selected: string;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <ExposedDropdownMenuBox expanded={expanded} onExpandedChange={setExpanded}>
      <Row
        modifiers={[menuAnchor(), fillMaxWidth(), padding(16, 16, 16, 16)]}
        verticalAlignment="center"
        horizontalArrangement={{ spacedBy: 8 }}>
        <Text style={{ typography: 'bodyLarge' }} color={colors.onSurface}>
          {label}
        </Text>
        <Spacer modifiers={[weight(1)]} />
        <Text style={{ typography: 'bodyLarge' }} color={colors.onSurfaceVariant}>
          {selected}
        </Text>
        <Icon source={UNFOLD_ICON} size={18} tint={colors.onSurfaceVariant} />
      </Row>
      <ExposedDropdownMenu expanded={expanded} onDismissRequest={() => setExpanded(false)}>
        {options.map((option) => (
          <DropdownMenuItem
            key={option}
            onClick={() => {
              onSelect(option);
              setExpanded(false);
            }}>
            <DropdownMenuItem.Text>
              <Text color={colors.onSurface}>{option}</Text>
            </DropdownMenuItem.Text>
          </DropdownMenuItem>
        ))}
      </ExposedDropdownMenu>
    </ExposedDropdownMenuBox>
  );
}
