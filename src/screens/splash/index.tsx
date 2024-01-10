import {Image, ImageBackground, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {
  heightPercent as hp,
  widthPrecent as wp,
} from '../../utils/ResponsiveScreen';
import {StackScreenProps} from '@react-navigation/stack';
import {StackNavigationParams} from '../../components/navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import db from '../../utils/db';
import {useDispatch} from 'react-redux';
type Props = StackScreenProps<StackNavigationParams, 'splash'>;
const Splash: React.FC<Props> = ({navigation}) => {
  const dispatch = useDispatch();
  useEffect(() => {
    setTimeout(() => {
      getIntialPage();
    }, 2000);
  }, []);
  const getIntialPage = async () => {
    const grade = await AsyncStorage.getItem('grade');
    const random = await AsyncStorage.getItem('random');
    const data = await db(grade ? grade : '');
    if (random != null) {
      dispatch({
        type: 'sightwords/setRendom',
        payload: JSON.parse(random),
      });
    }
    dispatch({
      type: 'sightwords/getDataFromdb',
      payload: data,
    });
    if (grade != null) {
      dispatch({
        type: 'sightwords/setGrade',
        payload: grade,
      });
    }
    dispatch({
      type: 'sightwords/resetbackSound',
    });
    navigation.reset({
      index: 0,
      routes: [{name: grade == null ? 'grade' : 'home'}],
    });
  };
  return (
    <View style={{flex: 1}}>
      <Image
        style={{height: hp(100), width: wp(100)}}
        source={require('../../asset/images/splashscreen.png')}
      />
    </View>
  );
};

export default Splash;
