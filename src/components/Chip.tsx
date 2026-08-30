import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { colors, palette, radius, spacing } from '../theme';
import { AppText } from './AppText';
import { tapFeedback } from './haptics';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress: () => void;
  emoji?: string;
}

/** Secilebilir etiket (hedef alani, enerji, motivasyon dogrulama vb.). */
export function Chip({ label, selected, onPress, emoji }: ChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: !!selected }}
      onPress={() => {
        void tapFeedback('light');
        onPress();
      }}
      style={[styles.chip, selected ? styles.selected : styles.unselected]}
    >
      <AppText
        variant="bodyStrong"
        color={selected ? colors.primaryText : colors.onSurface}
      >
        {emoji ? `${emoji}  ` : ''}
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    borderWidth: 1.5,
  },
  selected: { backgroundColor: colors.primary, borderColor: colors.primary },
  unselected: { backgroundColor: palette.white, borderColor: colors.border },
});
