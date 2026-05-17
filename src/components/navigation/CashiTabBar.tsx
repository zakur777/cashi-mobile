import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { GradientSurface } from '../ui/GradientSurface';
import { colors, radius, typography } from '../../design/tokens';

const mainRoutes = ['index', 'categories', 'balance'];

const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
  index: 'list-outline',
  categories: 'grid-outline',
  balance: 'home-outline',
};

export function CashiTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const currentRoute = state.routes[state.index];

  if (!currentRoute || !mainRoutes.includes(currentRoute.name)) {
    return null;
  }

  const visibleRoutes = state.routes.filter((route) => mainRoutes.includes(route.name));

  return (
    <View style={styles.shell}>
      {visibleRoutes.map((route) => {
        const originalIndex = state.routes.findIndex((item) => item.key === route.key);
        const focused = state.index === originalIndex;
        const options = descriptors[route.key]?.options;
        const label = typeof options?.title === 'string' ? options.title : route.name;
        const iconName = icons[route.name] ?? 'ellipse-outline';

        const content = (
          <>
            <Ionicons name={iconName} size={19} color={focused ? colors.textOnAccent : colors.textSecondary} />
            <Text style={[styles.label, focused ? styles.labelActive : undefined]}>{label}</Text>
          </>
        );

        return (
          <Pressable
            key={route.key}
            accessibilityRole="button"
            accessibilityState={focused ? { selected: true } : undefined}
            onPress={() => {
              const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
              if (!focused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            }}
            style={styles.itemShell}
          >
            {focused ? <GradientSurface style={styles.itemActive}>{content}</GradientSurface> : <View style={styles.item}>{content}</View>}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    position: 'absolute',
    left: 14,
    right: 14,
    bottom: 14,
    height: 72,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(15,16,26,0.9)',
    flexDirection: 'row',
    gap: 8,
    padding: 8,
  },
  itemShell: { flex: 1, borderRadius: radius.md, overflow: 'hidden' },
  item: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4, borderRadius: radius.md },
  itemActive: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 4, borderRadius: radius.md },
  label: { color: colors.textSecondary, fontFamily: typography.bodyBold, fontSize: 10, fontWeight: '800' },
  labelActive: { color: colors.textOnAccent },
});
