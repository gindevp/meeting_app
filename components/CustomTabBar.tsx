import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useWebViewPath } from '@/contexts/WebViewPathContext';
import { useNavVisibility } from '@/contexts/NavVisibilityContext';
import { useWebViewUser } from '@/contexts/WebViewUserContext';

const THEME_PRIMARY = '#1e3a5f';
const ICON_ACTIVE = '#ffffff';
const ICON_INACTIVE = 'rgba(255, 255, 255, 0.7)';

const TABS_BASE = [
  { path: '/', label: 'Trang chủ', icon: 'house.fill' as const },
  { path: '/calendar', label: 'Lịch họp', icon: 'calendar' as const },
  { path: '/notifications', label: 'Thông báo', icon: 'bell.fill' as const },
];
const TAB_REPORTS = { path: '/reports', label: 'Báo cáo', icon: 'doc.text.fill' as const };
const TAB_SETTINGS = { path: '/settings', label: 'Cài đặt', icon: 'gearshape.fill' as const };

const springConfig = { damping: 15, stiffness: 400 };

function TabItem({
  tab,
  isActive,
  onPress,
}: {
  tab: (typeof TABS_BASE)[0] | typeof TAB_REPORTS | typeof TAB_SETTINGS;
  isActive: boolean;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withTiming(0.94, { duration: 60 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, springConfig);
      }}
      style={styles.tab}
      accessibilityRole="button"
      accessibilityLabel={tab.label}
      accessibilityState={{ selected: isActive }}
    >
      <Animated.View style={[styles.tabInner, animatedStyle]}>
        <IconSymbol
          size={22}
          name={tab.icon}
          color={isActive ? ICON_ACTIVE : ICON_INACTIVE}
        />
        <Text
          style={[
            styles.label,
            isActive ? styles.labelActive : styles.labelInactive,
          ]}
          numberOfLines={1}
        >
          {tab.label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

export function CustomTabBar() {
  const insets = useSafeAreaInsets();
  const { path, setPath } = useWebViewPath();
  const { showNav } = useNavVisibility();
  const { isAdmin } = useWebViewUser();
  const [optimisticPath, setOptimisticPath] = React.useState<string | null>(null);

  React.useEffect(() => {
    setOptimisticPath(path);
  }, [path]);

  const tabs = [...TABS_BASE, ...(isAdmin ? [TAB_REPORTS] : []), TAB_SETTINGS];

  const onTabPress = (tabPath: string) => {
    setOptimisticPath(tabPath);
    setPath(tabPath);
  };

  if (!showNav) return null;

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {tabs.map((tab) => (
        <TabItem
          key={tab.path}
          tab={tab}
          isActive={(path === tab.path) || (optimisticPath === tab.path)}
          onPress={() => onTabPress(tab.path)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: THEME_PRIMARY,
    borderTopWidth: 0,
    paddingTop: 6,
    minHeight: 50,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  tabInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 10,
    marginTop: 2,
  },
  labelActive: {
    color: ICON_ACTIVE,
    fontWeight: '600',
  },
  labelInactive: {
    color: ICON_INACTIVE,
  },
});
