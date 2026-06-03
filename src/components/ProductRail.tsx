import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';

import type { Product } from '../data/catalog';
import { spacing } from '../theme';
import { ProductCard } from './ProductCard';

interface ProductRailProps {
  products: Product[];
  onProductPress: (productId: string) => void;
}

/** Horizontal, performant product rail backed by FlashList. */
export function ProductRail({ products, onProductPress }: ProductRailProps) {
  const renderItem = useCallback(
    ({ item }: { item: Product }) => (
      <ProductCard product={item} onPress={onProductPress} variant="rail" />
    ),
    [onProductPress],
  );

  return (
    <View style={styles.container}>
      <FlashList
        data={products}
        horizontal
        renderItem={renderItem}
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.content}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { height: 290 },
  content: { paddingHorizontal: spacing.lg },
});
