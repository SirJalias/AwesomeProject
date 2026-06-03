import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { categories } from '../data/catalog';
import { colors, radius, spacing } from '../theme';

export function CategoryChips() {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}>
      {categories.map(cat => (
        <View key={cat.id} style={styles.chip}>
          <Text style={styles.emoji}>{cat.emoji}</Text>
          <Text style={styles.label}>{cat.label}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: spacing.lg, gap: spacing.sm, paddingVertical: spacing.md },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.brandLight,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  emoji: { fontSize: 15 },
  label: { fontSize: 13, fontWeight: '700', color: colors.brandDark },
});
