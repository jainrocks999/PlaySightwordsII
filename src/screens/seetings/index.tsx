import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  BackHandler,
  Alert,
} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {StackNavigationParams} from '../../components/navigation';
import styles from './styles';
import {Image} from 'react-native-animatable';
import {heightPercent} from '../../utils/ResponsiveScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {random} from '../../types';
import {useDispatch, useSelector} from 'react-redux';
import {rootState} from '../../redux';
import db from '../../utils/db';
import {GAMBannerAd, BannerAdSize} from 'react-native-google-mobile-ads';
import {Addsid} from '../../utils/ads';
import TrackPlayer from 'react-native-track-player';
import {IAPContext} from '../../Context';
type Props = StackScreenProps<StackNavigationParams, 'setting'>;
const Setting: React.FC<Props> = ({navigation}) => {
  const IAP = useContext(IAPContext);
  const randomform = useSelector((state: rootState) => state.data.random);
  const backSound = useSelector((state: rootState) => state.data.backSound);
  const [random, setISRandom] = useState<random>();
  const [grad, setGrade] = useState<'tblWord' | 'tblWordG2' | ''>('');
  const [prevgrad, setprevGrade] = useState<'tblWord' | 'tblWordG2' | ''>('');
  useEffect(() => {
    getGrade();
  }, []);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleBackButton = () => {
      let shouldBack = false;
      for (let key in backSound) {
        let validKey = key as keyof typeof backSound;

        if (backSound[validKey]) {
          dispatch({
            type: 'sightwords/backSound',
            payload: {...backSound, [key]: key != 'home' ? false : true},
          });
          shouldBack = true;
        }
      }

      if (shouldBack) {
        navigation.goBack();
        return true;
      }

      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButton,
    );

    return () => {
      backHandler.remove();
    };
  }, [backSound, dispatch, navigation]);

  const getGrade = async () => {
    setISRandom(randomform);
    const grads = await AsyncStorage.getItem('grade');
    if (grads != null) {
      const validGrades: 'tblWord' | 'tblWordG2' = grads as
        | 'tblWord'
        | 'tblWordG2';
      setGrade(validGrades);
      setprevGrade(validGrades);
    }
  };
  const save = async () => {
    const dbData = await db(grad);
    await AsyncStorage.setItem('grade', grad);
    dispatch({
      type: 'sightwords/setRendom',
      payload: random,
    });

    await AsyncStorage.setItem('random', JSON.stringify(random));
    if (prevgrad != grad) {
      dispatch({
        type: 'sightwords/getDataFromdb',
        payload: dbData,
      });
      dispatch({
        type: 'sightwords/setGrade',
        payload: grad,
      });
    }
    let isGOBack = false;
    for (let key in backSound) {
      let validKey = key as keyof typeof backSound;
      if (backSound[validKey]) {
        dispatch({
          type: 'sightwords/backSound',
          payload: {
            ...backSound,
            [key]:
              prevgrad != grad
                ? backSound[validKey]
                : key != 'home'
                ? false
                : true,
          },
        });
        isGOBack = true;
      }
    }
    if (isGOBack) {
      navigation.goBack();
    }
  };

  return (
    <ImageBackground
      resizeMode="stretch"
      source={require('../../asset/images/stngbg.png')}
      style={styles.container}>
      <TouchableOpacity
        onPress={() => setGrade('tblWord')}
        style={styles.prePrimary}>
        <Image
          resizeMode="stretch"
          style={styles.image}
          source={
            grad == 'tblWord'
              ? require('../../asset/images/grade1selected.png')
              : require('../../asset/images/grrade1.png')
          }
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setGrade('tblWordG2');
        }}
        style={[styles.prePrimary, {marginTop: heightPercent(4)}]}>
        <Image
          resizeMode="stretch"
          style={styles.image}
          source={
            grad == 'tblWordG2'
              ? require('../../asset/images/grade2selected.png')
              : require('../../asset/images/grade2.png')
          }
        />
      </TouchableOpacity>
      <View style={styles.randomContainer}>
        <Text style={[styles.random, {fontWeight: '500'}]}>Random</Text>
        <TouchableOpacity
          onPress={() => setISRandom(prev => ({random: !prev?.random}))}
          style={styles.bckImage}>
          <Text style={styles.random}>{random?.random ? 'ON' : 'OFF'}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() => {
          save();
        }}
        style={styles.saveBtn}>
        <Text style={styles.random}>{'SAVE'}</Text>
      </TouchableOpacity>
      {!IAP?.hasPurchased && (
        <View style={{position: 'absolute', bottom: 0}}>
          <GAMBannerAd
            unitId={Addsid.BANNER}
            sizes={[BannerAdSize.ANCHORED_ADAPTIVE_BANNER]}
            requestOptions={{
              requestNonPersonalizedAdsOnly: true,
            }}
          />
        </View>
      )}
    </ImageBackground>
  );
};

export default Setting;
