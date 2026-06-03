import React, { useCallback, useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AddToCartBar } from '../components/AddToCartBar';
import { FavoriteButton } from '../components/FavoriteButton';
import { ProductGallery } from '../components/ProductGallery';
import { ProductRail } from '../components/ProductRail';
import { SectionHeader } from '../components/SectionHeader';
import { Stars } from '../components/Stars';
import { useRecentlyViewed } from '../context/RecentlyViewed';
import {
  getFrequentlyBoughtTogether,
  getProductById,
  getRelatedProducts,
} from '../data/catalog';
import type { ProductScreenProps } from '../navigation/types';
import { colors, radius, shadow, spacing } from '../theme';
import { formatPrice } from '../utils/format';

const GALLERY_HEIGHT = 360;

export function ProductScreen({ route, navigation }: ProductScreenProps) {
  const insets = useSafeAreaInsets();
  const { productId } = route.params;
  const product = getProductById(productId);
  const scrollY = useSharedValue(0);
  const { addRecentlyViewed } = useRecentlyViewed();

  const onScroll = useAnimatedScrollHandler(event => {
    scrollY.value = event.contentOffset.y;
  });

  useEffect(
    function recordView() {
      if (getProductById(productId)) {
        addRecentlyViewed(productId);
      }
    },
    [productId, addRecentlyViewed],
  );

  // Push (not navigate) so related products stack and remain navigable back.
  const openProduct = useCallback(
    (id: string) => navigation.push('Product', { productId: id }),
    [navigation],
  );

  // Parallax: image scales when over-pulled, drifts up as you scroll.
  const galleryStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(scrollY.value, [-GALLERY_HEIGHT, 0], [-GALLERY_HEIGHT / 2, 0], Extrapolation.CLAMP) },
      { scale: interpolate(scrollY.value, [-GALLERY_HEIGHT, 0], [2, 1], Extrapolation.CLAMP) },
    ],
  }));

  // Collapsing solid header fades in as the gallery scrolls away.
  const headerStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [GALLERY_HEIGHT - 140, GALLERY_HEIGHT - 70], [0, 1], Extrapolation.CLAMP),
  }));

  if (!product) {
    return (
      <View style={styles.missing}>
        <Text style={styles.missingText}>Product not found</Text>
      </View>
    );
  }

  const isSale = product.oldPrice !== undefined;
  const discount = isSale
    ? Math.round((1 - product.price / product.oldPrice!) * 100)
    : 0;
  const frequentlyBought = getFrequentlyBoughtTogether(product);
  const related = getRelatedProducts(product);

  return (
    <View style={styles.container} testID="product-screen">
      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacing.xxl }}>
        <Animated.View style={galleryStyle}>
          <ProductGallery images={product.images} height={GALLERY_HEIGHT} />
        </Animated.View>

        <View style={styles.body}>
          <Text style={styles.brand}>{product.brand}</Text>
          <Text style={styles.title}>{product.title}</Text>
          <Stars rating={product.rating} reviewCount={product.reviewCount} size={15} />

          <View style={styles.priceRow}>
            <Text style={styles.price}>{formatPrice(product.price)}</Text>
            {isSale && (
              <>
                <Text style={styles.oldPrice}>{formatPrice(product.oldPrice!)}</Text>
                <View style={styles.discount}>
                  <Text style={styles.discountText}>-{discount}%</Text>
                </View>
              </>
            )}
          </View>

          <View style={styles.delivery}>
            <Text style={styles.deliveryIcon}>🚚</Text>
            <Text style={styles.deliveryText}>{product.deliveryEstimate}</Text>
          </View>

          <Text style={styles.sectionTitle}>Features</Text>
          {product.features.map(feature => (
            <View key={feature} style={styles.feature}>
              <Text style={styles.bullet}>✓</Text>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>

        {frequentlyBought.length > 0 && (
          <>
            <SectionHeader title="Frequently bought together" action="" />
            <ProductRail products={frequentlyBought} onProductPress={openProduct} />
          </>
        )}

        {related.length > 0 && (
          <>
            <SectionHeader title="Related products" action="" />
            <ProductRail products={related} onProductPress={openProduct} />
          </>
        )}
      </Animated.ScrollView>

      {/* Collapsing solid header */}
      <Animated.View
        style={[styles.header, { height: insets.top + 52, paddingTop: insets.top }, headerStyle]}>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {product.title}
        </Text>
      </Animated.View>

      {/* Always-visible floating controls */}
      <View style={[styles.floating, { top: insets.top + spacing.xs }]} pointerEvents="box-none">
        <Pressable style={styles.back} onPress={() => navigation.goBack()} hitSlop={8}>
          <Text style={styles.backIcon}>‹</Text>
        </Pressable>
        <FavoriteButton size={40} />
      </View>

      <AddToCartBar price={product.price} bottomInset={insets.bottom} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  missing: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  missingText: { fontSize: 16, color: colors.textMuted },
  body: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    marginTop: -spacing.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  brand: { fontSize: 13, fontWeight: '800', color: colors.textMuted, textTransform: 'uppercase' },
  title: { fontSize: 22, fontWeight: '800', color: colors.text, lineHeight: 28 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm, marginTop: spacing.sm },
  price: { fontSize: 30, fontWeight: '900', color: colors.brandDark },
  oldPrice: { fontSize: 16, color: colors.textMuted, textDecorationLine: 'line-through' },
  discount: {
    backgroundColor: colors.sale,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  discountText: { color: colors.textInverse, fontWeight: '800', fontSize: 13 },
  delivery: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.brandLight,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  deliveryIcon: { fontSize: 18 },
  deliveryText: { fontSize: 14, fontWeight: '700', color: colors.brandDark },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: colors.text, marginTop: spacing.lg },
  feature: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start' },
  bullet: { color: colors.brand, fontWeight: '900', fontSize: 14 },
  featureText: { flex: 1, fontSize: 14, color: colors.text, lineHeight: 20 },
  description: { fontSize: 14, color: colors.textMuted, lineHeight: 21 },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    justifyContent: 'center',
    paddingHorizontal: 64,
    ...shadow.card,
  },
  headerTitle: { fontSize: 15, fontWeight: '700', color: colors.text, textAlign: 'center' },
  floating: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  back: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.card,
  },
  backIcon: { fontSize: 28, fontWeight: '700', color: colors.text, marginTop: -4 },
});
