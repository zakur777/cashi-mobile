import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { colors, radius, typography } from '../../src/design/tokens';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: { fontFamily: typography.display, fontWeight: '800' },
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
          backgroundColor: 'rgba(15,16,26,0.92)',
          padding: 8,
        },
        tabBarLabelStyle: { fontFamily: typography.bodyBold, fontSize: 10, fontWeight: '800' },
        tabBarItemStyle: { borderRadius: radius.md, minHeight: 56 },
        tabBarActiveBackgroundColor: colors.lime,
        tabBarInactiveBackgroundColor: 'transparent',
        tabBarActiveTintColor: colors.textOnAccent,
        tabBarInactiveTintColor: colors.textSecondary,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Movimientos',
          tabBarIcon: ({ color, size }) => <Ionicons name="list-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: 'Categorías',
          tabBarIcon: ({ color, size }) => <Ionicons name="grid-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="balance"
        options={{
          title: 'Balance',
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen name="category/[id]" options={{ href: null, title: 'Categoría' }} />
      <Tabs.Screen name="transaction/[id]" options={{ href: null, title: 'Movimiento' }} />
    </Tabs>
  );
}
