import { Redirect, Tabs } from 'expo-router';

import { CashiTabBar } from '../../src/components/navigation/CashiTabBar';
import { colors } from '../../src/design/tokens';
import { useAuth } from '../../src/hooks/useAuth';

export default function TabsLayout() {
  const auth = useAuth();

  if (auth.isInitializing) {
    return null;
  }

  if (!auth.isAuthenticated) {
    return <Redirect href="/" />;
  }

  return (
    <Tabs
      tabBar={(props) => <CashiTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.surface },
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
