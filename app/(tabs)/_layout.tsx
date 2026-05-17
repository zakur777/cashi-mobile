import { Tabs } from 'expo-router';

import { colors, radius } from '../../src/design/tokens';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: { fontWeight: '800' },
        tabBarStyle: {
          position: 'absolute',
          left: 14,
          right: 14,
          bottom: 14,
          height: 72,
          borderRadius: radius.lg,
          borderTopWidth: 1,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.surfaceCard,
          paddingTop: 8,
          paddingBottom: 8,
        },
        tabBarItemStyle: { borderRadius: radius.md },
        tabBarActiveTintColor: colors.lime,
        tabBarInactiveTintColor: colors.textSecondary,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Movimientos' }} />
      <Tabs.Screen name="categories" options={{ title: 'Categorías' }} />
      <Tabs.Screen name="balance" options={{ title: 'Balance' }} />
      <Tabs.Screen name="category/[id]" options={{ href: null, title: 'Categoría' }} />
      <Tabs.Screen name="transaction/[id]" options={{ href: null, title: 'Movimiento' }} />
    </Tabs>
  );
}
