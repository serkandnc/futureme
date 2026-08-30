import React from 'react';
import { ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing } from '../theme';

interface ScreenProps {
  children: React.ReactNode;
  scroll?: boolean;
  padded?: boolean;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  edges?: readonly Edge[];
  background?: string;
}

/** Ekran cercevesi: guvenli alan + arka plan + istege bagli kaydirma. */
export function Screen({
  children,
  scroll,
  padded = true,
  style,
  contentStyle,
  edges = ['top', 'bottom'],
  background = colors.background,
}: ScreenProps) {
  const inner = padded ? styles.padded : undefined;

  return (
    <SafeAreaView edges={edges} style={[styles.safe, { backgroundColor: background }, style]}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={[styles.scrollContent, inner, contentStyle]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.flex, inner, contentStyle]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },
  padded: { paddingHorizontal: spacing.lg },
  scrollContent: { paddingVertical: spacing.lg, paddingBottom: spacing.xxxl, gap: spacing.md },
});
