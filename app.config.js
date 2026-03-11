/** Cấu hình Expo: thêm extra.webBaseUrl cho môi trường production (build). */
const base = require('./app.json');

const isProd = process.env.NODE_ENV === 'production';
const webBaseUrl =
  process.env.EXPO_PUBLIC_WEB_BASE_URL ||
  (isProd ? 'https://plan-my-meeting.vercel.app' : undefined);

module.exports = {
  expo: {
    ...base.expo,
    owner: 'gindevp',
    projectId: '9aa9e954-5770-4fa0-8118-9f2cbf83df66',
    extra: {
      ...(base.expo.extra || {}),
      webBaseUrl,
      eas: {
        projectId: '9aa9e954-5770-4fa0-8118-9f2cbf83df66',
      },
    },
    ios: {
      ...base.expo.ios,
      config: {
        usesNonExemptEncryption: false,
      },
      infoPlist: {
        ...base.expo.ios?.infoPlist,
        ITSAppUsesNonExemptEncryption: false,
      },
    },
  },
};
