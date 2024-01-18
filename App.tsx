import {BackHandler, ToastAndroid} from 'react-native';
import React, {Fragment, useEffect, useRef} from 'react';
import Root from './src';
import showAdd from './src/utils/ads';

const App = () => {
  const doublePressTimeout = useRef<number | null>(null);
  const getAdd = () => {
    BackHandler.exitApp();
  };
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (
          doublePressTimeout.current &&
          doublePressTimeout.current + 2000 >= Date.now()
        ) {
          getAdd();
          return true;
        } else {
          ToastAndroid.show('Press again to exit', ToastAndroid.SHORT);
          doublePressTimeout.current = Date.now();
          return true;
        }
      },
    );
    return () => {
      backHandler.remove();
    };
  }, []);

  return (
    <Fragment>
      <Root />
    </Fragment>
  );
};

export default App;
