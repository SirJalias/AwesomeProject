import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing } from '../theme';

interface SectionHeaderProps {
  title: string;
  action?: string;
}

export function SectionHeader({ title, action = 'See all' }: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.action}>{action} ›</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  title: { fontSize: 19, fontWeight: '800', color: colors.text },
  action: { fontSize: 13, fontWeight: '700', color: colors.brand },
});
