import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

type PushTokenContextType = {
  expoPushToken: string | null;
  refreshToken: () => Promise<void>;
};

const PushTokenContext = createContext<PushTokenContextType>({
  expoPushToken: null,
  refreshToken: async () => {},
});

export function usePushToken() {
  return useContext(PushTokenContext);
}

export function PushTokenProvider({ children }: { children: React.ReactNode }) {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);

  const refreshToken = useCallback(async () => {
    if (!Device.isDevice) return;
    try {
      const { status: existing } = await Notifications.getPermissionsAsync();
      let final = existing;
      if (existing !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        final = status;
      }
      if (final !== 'granted') return;
      const projectId =
        Constants.easConfig?.projectId ??
        (Constants.expoConfig as { projectId?: string })?.projectId;
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: projectId as string | undefined,
      });
      setExpoPushToken(tokenData?.data ?? null);
    } catch (e) {
      setExpoPushToken(null);
    }
  }, []);

  useEffect(() => {
    refreshToken();
  }, [refreshToken]);

  return (
    <PushTokenContext.Provider value={{ expoPushToken, refreshToken }}>
      {children}
    </PushTokenContext.Provider>
  );
}
