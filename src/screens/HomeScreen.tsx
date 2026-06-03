import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HomeHeader } from '../components/HomeHeader';
import { ProductCard } from '../components/ProductCard';
import { TopBar } from '../components/TopBar';
import { recommended, type Product } from '../data/catalog';
import type { HomeScreenProps } from '../navigation/types';
import { colors, spacing } from '../theme';

export function HomeScreen({ navigation }: HomeScreenProps) {
  const insets = useSafeAreaInsets();

  const onProductPress = useCallback(
    (productId: string) => navigation.navigate('Product', { productId }),
    [navigation],
  );

  const renderItem = useCallback(
    ({ item }: { item: Product }) => (
      <ProductCard product={item} onPress={onProductPress} variant="grid" />
    ),
    [onProductPress],
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]} testID="home-screen">
      <TopBar />
      <FlashList
        data={recommended}
        numColumns={2}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListHeaderComponent={<HomeHeader onProductPress={onProductPress} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  list: { paddingHorizontal: spacing.md, paddingBottom: spacing.xxl },
});
