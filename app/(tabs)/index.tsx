import { StyleSheet, View } from 'react-native';
import { CustomTabBar } from '@/components/CustomTabBar';
import { EmbedWebView } from '@/components/EmbedWebView';
import { useWebViewPath } from '@/contexts/WebViewPathContext';

export default function HomeScreen() {
  const { path } = useWebViewPath();

  return (
    <View style={styles.container} collapsable={false}>
      <View style={styles.webviewWrap} collapsable={false}>
        <EmbedWebView path={path} />
      </View>
      <CustomTabBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webviewWrap: {
    flex: 1,
  },
});
