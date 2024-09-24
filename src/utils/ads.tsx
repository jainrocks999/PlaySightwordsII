import {
  AdEventType,
  InterstitialAd,
  TestIds,
} from 'react-native-google-mobile-ads';
import { Platform } from 'react-native';

export const Addsid = {
  ...Platform.select({
    android: {
      BANNER: 'ca-app-pub-3339897183017333/8814083988', //'ca-app-pub-3339897183017333/9093285589',
  Interstitial: 'ca-app-pub-3339897183017333/1290817186', // 'ca-app-pub-3339897183017333/1570018788',
    },
    ios: {
      BANNER: 'ca-app-pub-3339897183017333/6837823188',
      Interstitial: 'ca-app-pub-3339897183017333/4783868389',
    },
  }),
};







const requestOption = {
  requestNonPersonalizedAdsOnly: true,
  // keywords: ['fashion', 'clothing'],
};
const interstitial = InterstitialAd.createForAdRequest(
  Addsid.Interstitial,
  requestOption,
);
export default () => {
  console.log('calld');

  const unsubscribe = interstitial.addAdEventListener(
    AdEventType.LOADED,
    () => {
      interstitial.show();
    },
  );
  interstitial.load();
  return unsubscribe;
};
//Sight Words Second with Word Bingo
//com.playsightwords2New
