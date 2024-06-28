import {BackHandler, Platform, ToastAndroid} from 'react-native';
import React, {Fragment, useEffect, useRef} from 'react';
import Root from './src';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AdEventType, InterstitialAd} from 'react-native-google-mobile-ads';
import {Addsid} from './src/utils/ads';
const App = () => {
  const doublePressTimeout = useRef<number | null>(null);
  const getAdd = () => {
    BackHandler.exitApp();
  };
  useEffect(() => {
    const onBackPress = () => {
      handleBackButtonClick();
      return true;
    };
    BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    };
  }, []);
  const showAdd = () => {
    const requestOption = {
      requestNonPersonalizedAdsOnly: true,
    };

    const interstitial = InterstitialAd.createForAdRequest(
      Addsid.Interstitial ?? '',
      requestOption,
    );

    const unsubscribe = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        interstitial.show();
        BackHandler.exitApp();
      },
    );
    interstitial.load();
    return unsubscribe;
  };
  async function handleBackButtonClick() {
    const DOUBLE_PRESS_DELAY = 2000;
    const currentTime = Date.now();

    if (
      doublePressTimeout.current !== null &&
      doublePressTimeout.current + DOUBLE_PRESS_DELAY >= currentTime
    ) {
      const hasPurchased = await AsyncStorage.getItem('IN_APP_PURCHASE');
      if (hasPurchased) {
        BackHandler.exitApp();
        return true;
      } else {
        showAdd();
        return true;
      }
    } else {
      if (Platform.OS === 'android') {
        ToastAndroid.show('Press again to exit', ToastAndroid.SHORT);
      }
      doublePressTimeout.current = currentTime;
      return true;
    }
  }

  return (
    <Fragment>
      <Root />
    </Fragment>
  );
};

export default App;
