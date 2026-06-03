import React from 'react';
import { Image, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors, radius, spacing } from '../theme';

const logo = require('../assets/logo.png');

export function TopBar() {
  return (
    <View style={styles.container}>
      <View style={styles.brandRow}>
        <View style={styles.brand}>
          <Image source={logo} style={styles.logo} />
          <Text style={styles.wordmark}>
            Awesome<Text style={styles.wordmarkAlt}>Project</Text>
          </Text>
        </View>
        <View style={styles.icons}>
          <Text style={styles.icon}>♡</Text>
          <Text style={styles.icon}>👤</Text>
          <Text style={styles.icon}>🛒</Text>
        </View>
      </View>

      <View style={styles.search}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          placeholder="Search for a product or brand…"
          placeholderTextColor={colors.textMuted}
          style={styles.searchInput}
          returnKeyType="search"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
  },
  brand: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  logo: { width: 30, height: 30 },
  wordmark: { fontSize: 20, fontWeight: '800', color: colors.brandDark },
  wordmarkAlt: { color: colors.brand },
  icons: { flexDirection: 'row', alignItems: 'center', gap: spacing.lg },
  icon: { fontSize: 20 },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    height: 42,
    gap: spacing.sm,
  },
  searchIcon: { fontSize: 15 },
  searchInput: { flex: 1, fontSize: 14, color: colors.text, padding: 0 },
});
