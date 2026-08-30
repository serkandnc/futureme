import { Tabs } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';

import { colors } from '@/theme';

/** Alt navigasyon: Yol, Konus, Kanitlar, Profil (README bolum 12). */
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.onSurfaceFaint,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 64,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '700' },
      }}
    >
      <Tabs.Screen
        name="path"
        options={{ title: 'Yol', tabBarIcon: ({ color }) => <TabIcon icon="🛤️" color={color} /> }}
      />
      <Tabs.Screen
        name="chat"
        options={{ title: 'Konus', tabBarIcon: ({ color }) => <TabIcon icon="💬" color={color} /> }}
      />
      <Tabs.Screen
        name="evidence"
        options={{ title: 'Kanitlar', tabBarIcon: ({ color }) => <TabIcon icon="📦" color={color} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profil', tabBarIcon: ({ color }) => <TabIcon icon="👤" color={color} /> }}
      />
    </Tabs>
  );
}

function TabIcon({ icon, color }: { icon: string; color: string }) {
  return <Text style={{ fontSize: 20, color }}>{icon}</Text>;
}
