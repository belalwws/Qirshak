import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { G, Path, Circle, Text as SvgText } from 'react-native-svg';
import { useTheme } from '@/hooks/useTheme';
import { ChartData } from '@/types';
import { spacing, fontSize, fontWeight, borderRadius } from '@/theme';
import { formatAmount } from '@/utils';

interface PieChartProps {
  data: ChartData[];
  size?: number;
  innerRadius?: number;
  showLabels?: boolean;
  showLegend?: boolean;
  centerLabel?: string;
  centerValue?: string;
}

export const PieChart: React.FC<PieChartProps> = ({
  data,
  size = 200,
  innerRadius = 60,
  showLabels = false,
  showLegend = true,
  centerLabel,
  centerValue,
}) => {
  const { theme } = useTheme();
  const { colors } = theme;
  
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = size / 2;
  const center = size / 2;

  const createPieSlice = (
    startAngle: number,
    endAngle: number,
    color: string
  ): string => {
    const startX = center + radius * Math.cos((startAngle * Math.PI) / 180);
    const startY = center + radius * Math.sin((startAngle * Math.PI) / 180);
    const endX = center + radius * Math.cos((endAngle * Math.PI) / 180);
    const endY = center + radius * Math.sin((endAngle * Math.PI) / 180);
    
    const innerStartX = center + innerRadius * Math.cos((startAngle * Math.PI) / 180);
    const innerStartY = center + innerRadius * Math.sin((startAngle * Math.PI) / 180);
    const innerEndX = center + innerRadius * Math.cos((endAngle * Math.PI) / 180);
    const innerEndY = center + innerRadius * Math.sin((endAngle * Math.PI) / 180);
    
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
    
    return `
      M ${startX} ${startY}
      A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}
      L ${innerEndX} ${innerEndY}
      A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStartX} ${innerStartY}
      Z
    `;
  };

  let currentAngle = -90;
  const slices = data.map((item) => {
    const sliceAngle = (item.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;
    currentAngle = endAngle;
    
    return {
      ...item,
      path: createPieSlice(startAngle, endAngle, item.color),
      percentage: ((item.value / total) * 100).toFixed(1),
    };
  });

  if (total === 0) {
    return (
      <View style={[styles.container, { alignItems: 'center' }]}>
        <View
          style={[
            styles.emptyChart,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: colors.backgroundSecondary,
            },
          ]}
        >
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            لا توجد بيانات
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        <Svg width={size} height={size}>
          <G>
            {slices.map((slice, index) => (
              <Path key={index} d={slice.path} fill={slice.color} />
            ))}
            {/* Center circle */}
            <Circle cx={center} cy={center} r={innerRadius - 5} fill={colors.card} />
          </G>
        </Svg>
        
        {/* Center label */}
        {(centerLabel || centerValue) && (
          <View style={[styles.centerLabel, { width: innerRadius * 2, height: innerRadius * 2 }]}>
            {centerValue && (
              <Text style={[styles.centerValue, { color: colors.text }]}>
                {centerValue}
              </Text>
            )}
            {centerLabel && (
              <Text style={[styles.centerLabelText, { color: colors.textSecondary }]}>
                {centerLabel}
              </Text>
            )}
          </View>
        )}
      </View>
      
      {showLegend && (
        <View style={styles.legend}>
          {slices.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: item.color }]} />
              <Text style={[styles.legendLabel, { color: colors.text }]} numberOfLines={1}>
                {item.label}
              </Text>
              <Text style={[styles.legendValue, { color: colors.textSecondary }]}>
                {item.percentage}%
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  chartContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLabel: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerValue: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  centerLabelText: {
    fontSize: fontSize.sm,
    marginTop: spacing.xs,
  },
  legend: {
    marginTop: spacing.lg,
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.sm,
  },
  legendLabel: {
    flex: 1,
    fontSize: fontSize.sm,
  },
  legendValue: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  emptyChart: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: fontSize.sm,
  },
});
