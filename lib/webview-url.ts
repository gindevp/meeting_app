import Constants from 'expo-constants';
import { Platform } from 'react-native';

const WEB_PORT = '5173';
const PROD_WEB_BASE = 'https://plan-my-meeting.vercel.app';

function getLocalBaseUrl(): string {
  const host = Constants.expoConfig?.hostUri?.split(':')[0];
  if (host) return `http://${host}:${WEB_PORT}`;
  if (Platform.OS === 'android') return `http://10.0.2.2:${WEB_PORT}`;
  return `http://localhost:${WEB_PORT}`;
}

/**
 * Base URL cho WebView.
 * Dev (expo start): local. Prod (build): extra.webBaseUrl hoặc https://plan-my-meeting.vercel.app
 */
export function getWebBaseUrl(): string {
  const extra = Constants.expoConfig?.extra as { webBaseUrl?: string } | undefined;
  if (extra?.webBaseUrl) return extra.webBaseUrl.replace(/\/$/, '');
  if (__DEV__) return getLocalBaseUrl();
  return PROD_WEB_BASE.replace(/\/$/, '');
}

/** URL cho WebView: base + path + ?embed=1 để web ẩn sidebar/header */
export function getEmbedWebUrl(path: string = ''): string {
  const base = getWebBaseUrl().replace(/\/$/, '');
  const p = path === '' || path === '/' ? '' : path.startsWith('/') ? path : `/${path}`;
  const sep = p && p.includes('?') ? '&' : '?';
  return `${base}${p}${sep}embed=1`;
}
