import {
  Box,
  Card,
  Column,
  Host,
  Icon,
  type MaterialColors,
  Row,
  Spacer,
  Text,
  useMaterialColors,
} from '@expo/ui/jetpack-compose';
import {
  background,
  clip,
  fillMaxSize,
  fillMaxWidth,
  height,
  padding,
  Shapes,
  size,
  verticalScroll,
  weight,
  width,
} from '@expo/ui/jetpack-compose/modifiers';
import { type ImageSourcePropType } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  DISTANCE_TOTAL,
  DISTANCE_VALUES,
  HRV_AVERAGE,
  HRV_VALUES,
  STEPS_TOTAL,
  STEPS_VALUES,
} from '@/screens/health-summary.data';

const HEART_ICON = require('@/assets/icons/favorite.xml');
const BED_ICON = require('@/assets/icons/bed.xml');
const FLAME_ICON = require('@/assets/icons/local_fire_department.xml');
const CHEVRON_ICON = require('@/assets/icons/chevron_right.xml');

const RED = '#E5484D';
const INDIGO = '#5C6BC0';
const ORANGE = '#FB5B2D';

// Android counterpart of the SwiftUI Health Summary. Bar charts are rebuilt from
// Compose Box rows; the HRV line/dot chart has no @expo/ui Compose equivalent, so
// it is rendered as a simplified scatter (the one place the universal abstraction
// stops — a deliberate teaching point in the demo).
export default function HealthSummaryScreen() {
  const colors = useMaterialColors();
  const insets = useSafeAreaInsets();

  return (
    <Host style={{ flex: 1 }}>
      <Column
        modifiers={[
          fillMaxSize(),
          background(colors.background),
          verticalScroll(),
          padding(20, 20 + insets.top, 20, 20),
        ]}
        verticalArrangement={{ spacedBy: 16 }}>
        <Row modifiers={[fillMaxWidth()]} verticalAlignment="center">
          <Text style={{ fontWeight: '700', typography: 'titleLarge' }} color={colors.onSurface}>
            Pinned
          </Text>
          <Spacer modifiers={[weight(1)]} />
          <Text style={{ typography: 'bodyLarge' }} color={colors.primary}>
            Edit
          </Text>
        </Row>

        <HealthCard colors={colors}>
          <CardHeader
            colors={colors}
            icon={HEART_ICON}
            tint={RED}
            title="Heart Rate Variability"
            timestamp="Yesterday"
          />
          <Row modifiers={[fillMaxWidth()]} verticalAlignment="bottom">
            <Column verticalArrangement={{ spacedBy: 2 }}>
              <Text style={{ fontWeight: '600', typography: 'bodyLarge' }} color={colors.onSurfaceVariant}>
                Average
              </Text>
              <Metric colors={colors} value={HRV_AVERAGE} unit="ms" />
            </Column>
            <Spacer modifiers={[weight(1)]} />
            <HrvScatter colors={colors} values={HRV_VALUES} accent={RED} />
          </Row>
        </HealthCard>

        <HealthCard colors={colors}>
          <CardHeader
            colors={colors}
            icon={BED_ICON}
            tint={INDIGO}
            title="Sleep Score"
            timestamp="Today"
          />
          <Text
            style={{ fontWeight: '700', typography: 'titleLarge' }}
            color={colors.onSurface}
            modifiers={[padding(0, 16, 0, 4)]}>
            No Data
          </Text>
        </HealthCard>

        <HealthCard colors={colors}>
          <CardHeader colors={colors} icon={FLAME_ICON} tint={ORANGE} title="Steps" timestamp="15.21" />
          <Row modifiers={[fillMaxWidth()]} verticalAlignment="bottom">
            <Metric colors={colors} value={STEPS_TOTAL} unit="steps" />
            <Spacer modifiers={[weight(1)]} />
            <BarChart colors={colors} values={STEPS_VALUES} accent={ORANGE} />
          </Row>
        </HealthCard>

        <HealthCard colors={colors}>
          <CardHeader
            colors={colors}
            icon={FLAME_ICON}
            tint={ORANGE}
            title="Walking + Running Distance"
            timestamp="15.21"
          />
          <Row modifiers={[fillMaxWidth()]} verticalAlignment="bottom">
            <Metric colors={colors} value={DISTANCE_TOTAL} unit="km" />
            <Spacer modifiers={[weight(1)]} />
            <BarChart colors={colors} values={DISTANCE_VALUES} accent={ORANGE} />
          </Row>
        </HealthCard>
      </Column>
    </Host>
  );
}

function HealthCard({ children, colors }: { children: React.ReactNode; colors: MaterialColors }) {
  return (
    <Card colors={{ containerColor: colors.surfaceContainerHigh }} modifiers={[fillMaxWidth()]}>
      <Column
        modifiers={[fillMaxWidth(), padding(16, 18, 16, 18)]}
        verticalArrangement={{ spacedBy: 12 }}>
        {children}
      </Column>
    </Card>
  );
}

function CardHeader({
  colors,
  icon,
  timestamp,
  tint,
  title,
}: {
  colors: MaterialColors;
  icon: ImageSourcePropType;
  timestamp: string;
  tint: string;
  title: string;
}) {
  return (
    <Row modifiers={[fillMaxWidth()]} verticalAlignment="center" horizontalArrangement={{ spacedBy: 6 }}>
      <Icon source={icon} size={18} tint={tint} />
      <Text style={{ fontWeight: '700', typography: 'titleMedium' }} color={tint}>
        {title}
      </Text>
      <Spacer modifiers={[weight(1)]} />
      <Text style={{ typography: 'bodyMedium' }} color={colors.onSurfaceVariant}>
        {timestamp}
      </Text>
      <Icon source={CHEVRON_ICON} size={14} tint={colors.onSurfaceVariant} />
    </Row>
  );
}

function Metric({ colors, unit, value }: { colors: MaterialColors; unit: string; value: string }) {
  return (
    <Row verticalAlignment="bottom" horizontalArrangement={{ spacedBy: 4 }}>
      <Text style={{ fontSize: 32, fontWeight: '700' }} color={colors.onSurface}>
        {value}
      </Text>
      <Text style={{ fontSize: 16, fontWeight: '600' }} color={colors.onSurfaceVariant}>
        {unit}
      </Text>
    </Row>
  );
}

function BarChart({
  accent,
  colors,
  values,
}: {
  accent: string;
  colors: MaterialColors;
  values: number[];
}) {
  const max = Math.max(...values);
  const last = values.length - 1;

  return (
    <Row
      modifiers={[height(60), width(112)]}
      verticalAlignment="bottom"
      horizontalArrangement={{ spacedBy: 5 }}>
      {values.map((value, index) => (
        <Box
          key={index}
          modifiers={[
            weight(1),
            height(Math.max(4, Math.round((value / max) * 60))),
            clip(Shapes.RoundedCorner(2)),
            background(index === last ? accent : colors.surfaceVariant),
          ]}
        />
      ))}
    </Row>
  );
}

// Simplified HRV scatter — one dot per sample, positioned vertically by value,
// last sample accented. The SwiftUI version uses native Charts (line + layered
// dots), which has no @expo/ui Compose equivalent.
function HrvScatter({
  accent,
  colors,
  values,
}: {
  accent: string;
  colors: MaterialColors;
  values: number[];
}) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = Math.max(1, max - min);
  const last = values.length - 1;

  return (
    <Row
      modifiers={[height(50), width(150)]}
      verticalAlignment="top"
      horizontalArrangement={{ spacedBy: 4 }}>
      {values.map((value, index) => (
        <Box
          key={index}
          modifiers={[weight(1), padding(0, Math.round(((max - value) / span) * 38), 0, 0)]}
          contentAlignment="topCenter">
          <Box
            modifiers={[
              size(9, 9),
              clip(Shapes.Circle),
              background(index === last ? accent : colors.outline),
            ]}
          />
        </Box>
      ))}
    </Row>
  );
}
