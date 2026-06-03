import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme';

interface StarsProps {
  rating: number;
  reviewCount?: number;
  size?: number;
}

export function Stars({ rating, reviewCount, size = 13 }: StarsProps) {
  const rounded = Math.round(rating);
  return (
    <View style={styles.row}>
      <Text style={[styles.stars, { fontSize: size }]}>
        {'★★★★★'.slice(0, rounded)}
        <Text style={styles.starEmpty}>{'★★★★★'.slice(rounded)}</Text>
      </Text>
      {reviewCount !== undefined && (
        <Text style={styles.count}>
          {rating.toFixed(1)} ({reviewCount})
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  stars: { color: colors.star, letterSpacing: 1 },
  starEmpty: { color: colors.border },
  count: { marginLeft: 6, fontSize: 12, color: colors.textMuted },
});
