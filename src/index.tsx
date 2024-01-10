import {LogBox, StatusBar, View} from 'react-native';
import React from 'react';
import Navigation from './components/navigation';
import {Provider} from 'react-redux';
import {sightStore} from './redux';
const Root = () => {
  LogBox.ignoreAllLogs();
  return (
    <View style={{flex: 1}}>
      <StatusBar backgroundColor="#73cbea" />
      <Provider store={sightStore}>
        <Navigation />
      </Provider>
    </View>
  );
};

export default Root;
