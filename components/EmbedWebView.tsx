import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useEffect, useMemo, useRef } from 'react';
import { WebView } from 'react-native-webview';
import { getEmbedWebUrl } from '@/lib/webview-url';
import { useNavVisibility, isPublicPath } from '@/contexts/NavVisibilityContext';
import { useWebViewUser } from '@/contexts/WebViewUserContext';
import { useWebViewPath } from '@/contexts/WebViewPathContext';
import { usePushToken } from '@/contexts/PushTokenContext';

const THEME_PRIMARY = '#1e3a5f';

interface EmbedWebViewProps {
  path?: string;
}

export function EmbedWebView({ path = '' }: EmbedWebViewProps) {
  const uri = getEmbedWebUrl(path);
  const webViewRef = useRef<WebView>(null);
  const { setShowNavFromUrl } = useNavVisibility();
  const { setAuthorities, clearAuthorities } = useWebViewUser();
  const { setPath } = useWebViewPath();
  const { expoPushToken } = usePushToken();

  const applyUrl = (url: string) => {
    setShowNavFromUrl(url);
    if (isPublicPath(url)) clearAuthorities();
    try {
      const pathname = new URL(url).pathname || '/';
      setPath(pathname);
    } catch {
      // ignore
    }
  };

  const onNavigationStateChange = (navState: { url: string }) => {
    applyUrl(navState.url);
  };

  const handleMessage = (event: { nativeEvent: { data: string } }) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (typeof data.url === 'string') {
        applyUrl(data.url);
      }
      if (data.type === 'user' && Array.isArray(data.authorities)) setAuthorities(data.authorities);
    } catch {
      // ignore
    }
  };

  const hideNavCss = 'aside, header.sticky { display: none !important; } [class*="pl-64"] { padding-left: 0 !important; }';
  const injectedJavaScript = useMemo(() => {
    const setToken = `(function(){ try{ window.__EXPO_PUSH_TOKEN__ = ${JSON.stringify(expoPushToken ?? '')}; }catch(e){} })(); `;
    const injectCss = `(function(){ var s=document.createElement('style'); s.textContent=${JSON.stringify(hideNavCss)}; document.head.appendChild(s); })(); `;
    const postUrl =
      `(function(){ var post=function(){ try{ window.ReactNativeWebView&&window.ReactNativeWebView.postMessage(JSON.stringify({url:window.location.href})); }catch(e){} }; post(); var a=history.pushState,b=history.replaceState; history.pushState=function(){ a.apply(this,arguments); post(); }; history.replaceState=function(){ b.apply(this,arguments); post(); }; window.addEventListener('popstate',post); })(); `;
    return `${setToken}${injectCss}${postUrl}true;`;
  }, [expoPushToken]);

  useEffect(() => {
    // Token có thể lấy sau khi WebView đã load; inject lại để web hook đọc được.
    const js = `try{ window.__EXPO_PUSH_TOKEN__ = ${JSON.stringify(expoPushToken ?? '')}; }catch(e){} true;`;
    webViewRef.current?.injectJavaScript(js);
  }, [expoPushToken]);

  return (
    <WebView
      ref={webViewRef}
      source={{ uri }}
      style={styles.webview}
      javaScriptEnabled
      domStorageEnabled
      startInLoadingState
      onNavigationStateChange={onNavigationStateChange}
      onMessage={handleMessage}
      injectedJavaScript={injectedJavaScript}
      renderLoading={() => (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={THEME_PRIMARY} />
        </View>
      )}
      renderError={() => (
        <View style={styles.error}>
          <Text style={styles.errorText}>Không thể tải trang. Kiểm tra URL hoặc mạng.</Text>
          <Text style={styles.errorUrl}>{uri}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  webview: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  error: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#fff',
  },
  errorText: {
    textAlign: 'center',
    marginBottom: 8,
  },
  errorUrl: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
});
