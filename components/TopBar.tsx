import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const HEADER_COLOR = '#1e3a5f';

export function TopBar() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingTop: insets.top }]} />
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: HEADER_COLOR,
    paddingBottom: 12,
    paddingTop: 12,
  },
});
