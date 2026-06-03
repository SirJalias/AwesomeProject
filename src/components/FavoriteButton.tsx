import React, { useState } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { colors, shadow } from '../theme';

interface FavoriteButtonProps {
  size?: number;
  initial?: boolean;
}

/**
 * Heart toggle with a Reanimated "pop" spring on activation.
 * Scales up then settles, mimicking the like animation on product cards.
 */
export function FavoriteButton({ size = 36, initial = false }: FavoriteButtonProps) {
  const [active, setActive] = useState(initial);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const toggle = () => {
    const next = !active;
    setActive(next);
    if (next) {
      scale.value = withSequence(
        withTiming(1.35, { duration: 120 }),
        withSpring(1, { damping: 6, stiffness: 200 }),
      );
    } else {
      scale.value = withSpring(1);
    }
  };

  return (
    <Pressable onPress={toggle} hitSlop={8} accessibilityRole="button">
      <Animated.View
        style={[
          styles.circle,
          { width: size, height: size, borderRadius: size / 2 },
          animatedStyle,
        ]}>
        <Text style={[styles.heart, { color: active ? colors.sale : colors.textMuted }]}>
          {active ? '♥' : '♡'}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  circle: {
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.card,
  },
  heart: { fontSize: 18, lineHeight: 22 },
});
