import { StyleSheet, View } from 'react-native';
import { EmbedWebView } from '@/components/EmbedWebView';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <EmbedWebView path="/settings" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
