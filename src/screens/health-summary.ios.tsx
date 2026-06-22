import {
  Chart,
  type ChartDataPoint,
  Host,
  HStack,
  Image,
  Spacer,
  Text,
  VStack,
  ZStack,
} from '@expo/ui/swift-ui';
import { background, font, foregroundStyle, frame, offset, padding, shapes } from '@expo/ui/swift-ui/modifiers';
import { type SFSymbol } from 'expo-symbols';
import { type ColorValue, PlatformColor, ScrollView, StyleSheet } from 'react-native';

import {
  DISTANCE_TOTAL,
  DISTANCE_VALUES,
  HRV_AVERAGE,
  HRV_VALUES,
  STEPS_TOTAL,
  STEPS_VALUES,
} from '@/screens/health-summary.data';
import { secondaryText } from '@/styles';

// Warm coral -> pink -> lavender wash fading into the grouped background, like
// the Health app Summary screen.
const SUMMARY_GRADIENT =
  'linear-gradient(180deg, #F6A98C 0%, #F2A0AE 12%, #E0AAC9 22%, #C8BAE6 32%, rgba(242,242,247,1) 44%)';

const barGray = PlatformColor('systemGray5');
// Health's "Steps" orange, pulled slightly redder than systemOrange's amber.
const stepsOrange = '#FB5B2D';
const clear = 'transparent';
// White fill of the hollow HRV dots; tracks the card surface in light/dark.
const cardFill = PlatformColor('secondarySystemGroupedBackground');
const lineGray = PlatformColor('systemGray3');

const HRV_DATA: ChartDataPoint[] = HRV_VALUES.map((y, i) => ({ x: String(i + 1), y }));
const LAST_HRV = HRV_DATA.length - 1;
// `lineStyle.width` is a no-op in this @expo/ui build, so the thick line is faked
// by stacking several 1px line layers a pixel apart. The dots are then layered as
// point charts on top, all sharing the same data domain so they align.
const HRV_LINE_OFFSETS = [-1, 0, 1];
const HRV_DOTS: ChartDataPoint[] = HRV_DATA.map((point) => ({ ...point, color: lineGray }));
const HRV_FILL: ChartDataPoint[] = HRV_DATA.map((point) => ({ ...point, color: cardFill }));
const HRV_ENDPOINT: ChartDataPoint[] = HRV_DATA.map((point, index) => ({
  ...point,
  color: index === LAST_HRV ? PlatformColor('systemRed') : clear,
}));

const STEPS_DATA: ChartDataPoint[] = STEPS_VALUES.map((y, i) => ({
  color: i === STEPS_VALUES.length - 1 ? stepsOrange : barGray,
  x: String(i + 1),
  y,
}));

const DISTANCE_DATA: ChartDataPoint[] = DISTANCE_VALUES.map((y, i) => ({
  color: i === DISTANCE_VALUES.length - 1 ? stepsOrange : barGray,
  x: String(i + 1),
  y,
}));

function Card({ children }: { children: React.ReactNode }) {
  return (
    <VStack
      alignment="leading"
      spacing={12}
      modifiers={[
        frame({ alignment: 'leading', maxWidth: Infinity }),
        padding({ horizontal: 16, vertical: 22 }),
        background(cardFill, shapes.roundedRectangle({ cornerRadius: 26 })),
      ]}>
      {children}
    </VStack>
  );
}

function CardHeader({
  systemName,
  timestamp,
  tint,
  title,
}: {
  systemName: SFSymbol;
  timestamp: string;
  tint: ColorValue;
  title: string;
}) {
  return (
    <HStack spacing={6}>
      <Image systemName={systemName} size={18} color={tint} />
      <Text modifiers={[font({ size: 18, weight: 'bold' }), foregroundStyle(tint)]}>{title}</Text>
      <Spacer />
      <Text modifiers={[font({ size: 17 }), secondaryText]}>{timestamp}</Text>
      <Image systemName="chevron.forward" size={14} color={PlatformColor('systemGray2')} />
    </HStack>
  );
}

function Metric({ unit, value }: { unit: string; value: string }) {
  return (
    <HStack alignment="firstTextBaseline" spacing={5}>
      <Text modifiers={[font({ design: 'rounded', size: 34, weight: 'bold' })]}>{value}</Text>
      <Text modifiers={[font({ design: 'rounded', size: 17, weight: 'semibold' }), secondaryText]}>
        {unit}
      </Text>
    </HStack>
  );
}

export default function HealthSummaryScreen() {
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic">
      <Host matchContents={{ vertical: true }} style={styles.host}>
        <VStack
          alignment="leading"
          spacing={16}
          modifiers={[frame({ alignment: 'leading', maxWidth: Infinity })]}>
          <HStack alignment="firstTextBaseline">
            <Text modifiers={[font({ size: 22, weight: 'bold' })]}>Pinned</Text>
            <Spacer />
            <Text modifiers={[font({ size: 17 }), foregroundStyle(PlatformColor('link'))]}>Edit</Text>
          </HStack>

          <Card>
            <CardHeader
              systemName="heart.fill"
              title="Heart Rate Variability"
              tint={PlatformColor('systemRed')}
              timestamp="Yesterday"
            />
            <HStack alignment="bottom">
              <VStack alignment="leading" spacing={2}>
                <Text modifiers={[font({ size: 17, weight: 'semibold' }), secondaryText]}>
                  Average
                </Text>
                <Metric value={HRV_AVERAGE} unit="ms" />
              </VStack>
              <Spacer />
              <ZStack modifiers={[frame({ height: 50, width: 150 })]}>
                {HRV_LINE_OFFSETS.map((dy) => (
                  <Chart
                    key={dy}
                    data={HRV_DATA}
                    type="line"
                    showGrid={false}
                    lineStyle={{ color: lineGray, pointSize: 1, pointStyle: 'circle' }}
                    modifiers={[frame({ height: 50, width: 150 }), offset({ y: dy })]}
                  />
                ))}
                <Chart
                  data={HRV_DOTS}
                  type="point"
                  showGrid={false}
                  pointStyle={{ pointSize: 115, pointStyle: 'circle' }}
                  modifiers={[frame({ height: 50, width: 150 })]}
                />
                <Chart
                  data={HRV_ENDPOINT}
                  type="point"
                  showGrid={false}
                  pointStyle={{ pointSize: 115, pointStyle: 'circle' }}
                  modifiers={[frame({ height: 50, width: 150 })]}
                />
                <Chart
                  data={HRV_FILL}
                  type="point"
                  showGrid={false}
                  pointStyle={{ pointSize: 32, pointStyle: 'circle' }}
                  modifiers={[frame({ height: 50, width: 150 })]}
                />
              </ZStack>
            </HStack>
          </Card>

          <Card>
            <CardHeader
              systemName="bed.double.fill"
              title="Sleep Score"
              tint={PlatformColor('systemIndigo')}
              timestamp="Today"
            />
            <Text
              modifiers={[
                font({ design: 'rounded', size: 26, weight: 'bold' }),
                padding({ bottom: 4, top: 24 }),
              ]}>
              No Data
            </Text>
          </Card>

          <Card>
            <CardHeader systemName="flame.fill" title="Steps" tint={stepsOrange} timestamp="15.21" />
            <HStack alignment="bottom">
              <Metric value={STEPS_TOTAL} unit="steps" />
              <Spacer />
              <Chart
                data={STEPS_DATA}
                type="bar"
                showGrid={false}
                barStyle={{ cornerRadius: 2, width: 12 }}
                modifiers={[frame({ height: 60, width: 112 })]}
              />
            </HStack>
          </Card>

          <Card>
            <CardHeader
              systemName="flame.fill"
              title="Walking + Running Distance"
              tint={stepsOrange}
              timestamp="15.21"
            />
            <HStack alignment="bottom">
              <Metric value={DISTANCE_TOTAL} unit="km" />
              <Spacer />
              <Chart
                data={DISTANCE_DATA}
                type="bar"
                showGrid={false}
                barStyle={{ cornerRadius: 2, width: 12 }}
                modifiers={[frame({ height: 60, width: 112 })]}
              />
            </HStack>
          </Card>
        </VStack>
      </Host>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { gap: 16, paddingBottom: 24, paddingHorizontal: 20 },
  host: { backgroundColor: 'transparent', width: '100%' },
  scroll: { backgroundColor: '#F2F2F7', experimental_backgroundImage: SUMMARY_GRADIENT, flex: 1 },
});
