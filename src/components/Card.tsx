import React from 'react';
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { colors, radius, shadow, spacing } from '../theme';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
  tone?: 'surface' | 'muted';
}

/** Yumusak, hacimli ve dokunulabilir kart (README bolum 12). */
export function Card({ children, onPress, style, padded = true, tone = 'surface' }: CardProps) {
  const content = (
    <View
      style={[
        styles.card,
        { backgroundColor: tone === 'surface' ? colors.surface : colors.surfaceMuted },
        padded && styles.padded,
        style,
      ]}
    >
      {children}
    </View>
  );

  if (!onPress) return content;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => pressed && styles.pressed}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    ...shadow.soft,
  },
  padded: { padding: spacing.lg },
  pressed: { opacity: 0.9, transform: [{ scale: 0.995 }] },
});
