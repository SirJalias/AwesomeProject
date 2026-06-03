import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import { useRecentlyViewed } from '../context/RecentlyViewed';
import { bestSellers, categories, featuredProduct, gardenPicks } from '../data/catalog';
import { colors, radius, shadow, spacing } from '../theme';
import { CategoryChips } from './CategoryChips';
import { ProductRail } from './ProductRail';
import { SectionHeader } from './SectionHeader';

interface HomeHeaderProps {
  onProductPress: (productId: string) => void;
}

export function HomeHeader({ onProductPress }: HomeHeaderProps) {
  const { recentlyViewed } = useRecentlyViewed();

  return (
    <View>
      <CategoryChips />

      <Animated.View entering={FadeInDown.duration(500)}>
        <Pressable
          style={styles.hero}
          onPress={() => onProductPress(featuredProduct.id)}>
          <Image source={{ uri: featuredProduct.image }} style={styles.heroImage} />
          <View style={styles.heroOverlay}>
            <Text style={styles.heroKicker}>GARDEN · ROBOT MOWERS</Text>
            <Text style={styles.heroTitle}>Up to -30% on connected mowing</Text>
            <View style={styles.heroCta}>
              <Text style={styles.heroCtaText}>Shop the deal</Text>
            </View>
          </View>
        </Pressable>
      </Animated.View>

      <SectionHeader title="Categories" action="See all" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.universeRow}>
        {categories.map(cat => (
          <View key={cat.id} style={styles.universe}>
            <View style={styles.universeIcon}>
              <Text style={styles.universeEmoji}>{cat.emoji}</Text>
            </View>
            <Text style={styles.universeLabel}>{cat.label}</Text>
          </View>
        ))}
      </ScrollView>

      {recentlyViewed.length > 0 && (
        <>
          <SectionHeader title="Recently viewed" action="" />
          <ProductRail products={recentlyViewed} onProductPress={onProductPress} />
        </>
      )}

      <SectionHeader title="Best sellers" />
      <ProductRail products={bestSellers} onProductPress={onProductPress} />

      <SectionHeader title="For your garden" />
      <ProductRail products={gardenPicks} onProductPress={onProductPress} />

      <SectionHeader title="Recommended for you" action="" />
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    marginHorizontal: spacing.lg,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.brandDark,
    ...shadow.card,
  },
  heroImage: { width: '100%', height: 180, opacity: 0.6 },
  heroOverlay: { position: 'absolute', left: 0, right: 0, bottom: 0, padding: spacing.lg },
  heroKicker: { color: colors.brandLight, fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  heroTitle: {
    color: colors.textInverse,
    fontSize: 22,
    fontWeight: '800',
    marginTop: spacing.xs,
    maxWidth: '85%',
  },
  heroCta: {
    alignSelf: 'flex-start',
    marginTop: spacing.md,
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
  },
  heroCtaText: { color: colors.textInverse, fontWeight: '800', fontSize: 13 },
  universeRow: { paddingHorizontal: spacing.lg, gap: spacing.lg },
  universe: { alignItems: 'center', width: 64 },
  universeIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  universeEmoji: { fontSize: 26 },
  universeLabel: { fontSize: 11, fontWeight: '600', color: colors.text, marginTop: 6, textAlign: 'center' },
});
