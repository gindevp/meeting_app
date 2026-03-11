import { StyleSheet, View } from 'react-native';
import { EmbedWebView } from '@/components/EmbedWebView';

export default function DashboardScreen() {
  return (
    <View style={styles.container}>
      <EmbedWebView path="/calendar" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
