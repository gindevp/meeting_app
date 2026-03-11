import * as SplashScreen from 'expo-splash-screen';
import { Image } from 'expo-image';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  View,
} from 'react-native';

SplashScreen.preventAutoHideAsync();

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const LOGO_SIZE = Math.min(SCREEN_WIDTH * 0.44, 180);
const PROGRESS_DURATION = 1600;
const PROGRESS_WIDTH = Math.min(SCREEN_WIDTH - 64, 260);

export function AppSplash({
  onFinish,
  children,
}: {
  onFinish: () => void;
  children: React.ReactNode;
}) {
  const [showSplash, setShowSplash] = useState(true);
  const progressAnim = useRef(new Animated.Value(0)).current;

  const hideSplash = useCallback(async () => {
    try {
      await SplashScreen.hideAsync();
    } catch {
      // ignore
    }
    setShowSplash(false);
    onFinish();
  }, [onFinish]);

  // Ẩn splash native ngay khi màn custom đã render → chỉ còn 1 splash, không nháy
  useEffect(() => {
    const hideNative = async () => {
      try {
        await SplashScreen.hideAsync();
      } catch {
        // ignore
      }
    };
    hideNative();
  }, []);

  useEffect(() => {
    if (!showSplash) return;

    const run = async () => {
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: PROGRESS_DURATION,
        useNativeDriver: false,
      }).start(async () => {
        await hideSplash();
      });
    };
    run();
  }, [showSplash, progressAnim, hideSplash]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, PROGRESS_WIDTH],
  });

  if (!showSplash) {
    return <>{children}</>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoWrap}>
          <Image
            source={require('@/assets/images/icon.png')}
            style={[styles.logo, { width: LOGO_SIZE, height: LOGO_SIZE }]}
            contentFit="contain"
          />
        </View>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
        </View>
        <Text style={styles.appName}>MeetViet</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 32,
    backgroundColor: 'transparent',
  },
  logoWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    backgroundColor: 'transparent',
  },
  logo: {
    backgroundColor: 'transparent',
  },
  appName: {
    fontSize: 26,
    fontWeight: '700',
    color: '#ffffff',
    marginTop: 20,
    letterSpacing: 0.5,
  },
  progressTrack: {
    width: PROGRESS_WIDTH,
    height: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 2.5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 2.5,
  },
});
