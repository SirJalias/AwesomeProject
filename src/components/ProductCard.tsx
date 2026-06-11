import React, { memo, useRef } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';

import type { Product } from '../data/catalog';
import { colors, radius, shadow, spacing } from '../theme';
import { formatPrice } from '../utils/format';
import { FavoriteButton } from './FavoriteButton';
import { Stars } from './Stars';

interface ProductCardProps {
  product: Product;
  onPress: (productId: string) => void;
  variant?: 'rail' | 'grid';
  testID?: string;
}

function ProductCardComponent({
  product,
  onPress,
  variant = 'rail',
  testID,
}: ProductCardProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const isSale = product.oldPrice !== undefined;

  return (
    <Animated.View
      style={[styles.wrapper, variant === 'rail' ? styles.rail : styles.grid, { transform: [{ scale }] }]}>
      <Pressable
        testID={testID ?? `product-card-${product.id}`}
        accessibilityRole="button"
        accessibilityLabel={`${product.brand} ${product.title}`}
        onPress={() => onPress(product.id)}
        onPressIn={() => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start()}
        onPressOut={() => Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start()}
        style={styles.card}>
        <View style={styles.imageWrap}>
          <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />
          {product.badge && (
            <View style={[styles.badge, isSale && product.badge.startsWith('-') && styles.badgeSale]}>
              <Text style={styles.badgeText}>{product.badge}</Text>
            </View>
          )}
          <View style={styles.favorite}>
            <FavoriteButton size={32} />
          </View>
        </View>

        <View style={styles.info}>
          <Text style={styles.brand}>{product.brand}</Text>
          <Text style={styles.title} numberOfLines={2}>
            {product.title}
          </Text>
          <Stars rating={product.rating} reviewCount={product.reviewCount} />

          <View style={styles.priceRow}>
            <Text style={styles.price}>{formatPrice(product.price)}</Text>
            {isSale && (
              <Text style={styles.oldPrice}>{formatPrice(product.oldPrice!)}</Text>
            )}
          </View>

          {product.freeDelivery && (
            <Text style={styles.delivery}>🚚 Free delivery</Text>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}

export const ProductCard = memo(ProductCardComponent);

const styles = StyleSheet.create({
  wrapper: { borderRadius: radius.lg },
  rail: { width: 180, marginRight: spacing.md },
  grid: { flex: 1, margin: spacing.xs },
  card: {
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadow.card,
  },
  imageWrap: { backgroundColor: colors.surface },
  image: { width: '100%', aspectRatio: 1 },
  badge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.brandDark,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  badgeSale: { backgroundColor: colors.sale },
  badgeText: { color: colors.textInverse, fontSize: 11, fontWeight: '800' },
  favorite: { position: 'absolute', top: spacing.sm, right: spacing.sm },
  info: { padding: spacing.sm, gap: 2 },
  brand: { fontSize: 11, fontWeight: '700', color: colors.textMuted, textTransform: 'uppercase' },
  title: { fontSize: 13, fontWeight: '600', color: colors.text, minHeight: 34 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm, marginTop: 2 },
  price: { fontSize: 17, fontWeight: '800', color: colors.brandDark },
  oldPrice: {
    fontSize: 12,
    color: colors.textMuted,
    textDecorationLine: 'line-through',
  },
  delivery: { fontSize: 11, color: colors.success, fontWeight: '600', marginTop: 2 },
});
