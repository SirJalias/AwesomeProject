import React, { useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';

import { colors, shadow } from '../theme';

interface FavoriteButtonProps {
  size?: number;
  initial?: boolean;
}

/**
 * Heart toggle with a "pop" spring on activation.
 * Scales up then settles, mimicking the like animation on product cards.
 */
export function FavoriteButton({ size = 36, initial = false }: FavoriteButtonProps) {
  const [active, setActive] = useState(initial);
  const scale = useRef(new Animated.Value(1)).current;

  const toggle = () => {
    const next = !active;
    setActive(next);
    if (next) {
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.35, duration: 120, useNativeDriver: true }),
        Animated.spring(scale, { toValue: 1, damping: 6, stiffness: 200, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
    }
  };

  return (
    <Pressable onPress={toggle} hitSlop={8} accessibilityRole="button">
      <Animated.View
        style={[
          styles.circle,
          { width: size, height: size, borderRadius: size / 2 },
          { transform: [{ scale }] },
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
