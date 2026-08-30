import React from 'react';
import { StyleProp, Text, TextProps, TextStyle } from 'react-native';

import { colors, typography } from '../theme';

type Variant = keyof typeof typography;

interface AppTextProps extends TextProps {
  variant?: Variant;
  color?: string;
  center?: boolean;
  style?: StyleProp<TextStyle>;
}

/**
 * Tipografi belirtecine dayali metin ilkeli. Ekranlar dogrudan RN Text yerine
 * bunu kullanir; boylece olcek ve renk tek yerden gelir.
 */
export function AppText({
  variant = 'body',
  color = colors.onSurface,
  center,
  style,
  children,
  ...rest
}: AppTextProps) {
  return (
    <Text
      style={[typography[variant] as TextStyle, { color }, center && { textAlign: 'center' }, style]}
      {...rest}
    >
      {children}
    </Text>
  );
}
