import { Tabs } from 'expo-router';

import { colors } from '../../src/design/tokens';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.textOnPrimary,
        tabBarStyle: { backgroundColor: '#FFFFFF' },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.secondary,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Transacciones' }} />
      <Tabs.Screen name="categories" options={{ title: 'Categorías' }} />
      <Tabs.Screen name="balance" options={{ title: 'Balance' }} />
    </Tabs>
  );
}
