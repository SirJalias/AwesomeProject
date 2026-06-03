import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

import { colors, radius, spacing } from '../theme';
import { formatPrice } from '../utils/format';

interface AddToCartBarProps {
  price: number;
  bottomInset: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/** Sticky bottom bar with quantity stepper and an animated add-to-cart button. */
export function AddToCartBar({ price, bottomInset }: AddToCartBarProps) {
  const [qty, setQty] = useState(1);
  const scale = useSharedValue(1);
  const buttonStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <View style={[styles.container, { paddingBottom: Math.max(bottomInset, spacing.md) }]}>
      <View style={styles.stepper}>
        <Pressable onPress={() => setQty(q => Math.max(1, q - 1))} hitSlop={8}>
          <Text style={styles.stepperBtn}>−</Text>
        </Pressable>
        <Text style={styles.qty}>{qty}</Text>
        <Pressable onPress={() => setQty(q => q + 1)} hitSlop={8}>
          <Text style={styles.stepperBtn}>+</Text>
        </Pressable>
      </View>

      <AnimatedPressable
        testID="add-to-cart-button"
        accessibilityRole="button"
        style={[styles.cta, buttonStyle]}
        onPressIn={() => (scale.value = withSpring(0.96))}
        onPressOut={() => (scale.value = withSpring(1))}>
        <Text style={styles.ctaText}>Add to cart</Text>
        <Text style={styles.ctaPrice}>{formatPrice(price * qty)}</Text>
      </AnimatedPressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    gap: spacing.md,
  },
  stepperBtn: { fontSize: 22, fontWeight: '700', color: colors.brandDark, width: 24, textAlign: 'center' },
  qty: { fontSize: 16, fontWeight: '700', color: colors.text, minWidth: 16, textAlign: 'center' },
  cta: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.brand,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    height: 52,
  },
  ctaText: { color: colors.textInverse, fontSize: 16, fontWeight: '800' },
  ctaPrice: { color: colors.textInverse, fontSize: 16, fontWeight: '800' },
});
