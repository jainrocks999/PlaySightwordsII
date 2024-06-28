import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  BackHandler,
  Modal,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {StackScreenProps} from '@react-navigation/stack';
import {StackNavigationParams} from '../../components/navigation';
import styles from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {dbData, dbItem} from '../../types';
import {FlatList} from 'react-native-gesture-handler';
import player from '../../utils/player';
import resetPlayer from '../../utils/resetPlayer';
import {useDispatch} from 'react-redux';
import {widthPrecent} from '../../utils/ResponsiveScreen';
import MyModal from '../../components/Modal';
import {GAMBannerAd, BannerAdSize} from 'react-native-google-mobile-ads';
import showAdd, {Addsid} from '../../utils/ads';
import {IAPContext} from '../../Context';
type Props = StackScreenProps<StackNavigationParams, 'practice'>;
const Practice: React.FC<Props> = ({navigation}) => {
  const IAP = useContext(IAPContext);
  const [grade, setGrade] = useState('gradeA');
  const [data, setData] = useState<dbData>();
  const [isVisible, setIsvisible] = useState(false);
  useEffect(() => {
    getDataWithGrade('gradeA');
  }, []);
  const getDataWithGrade = async (type: string) => {
    const getData = await AsyncStorage.getItem(type);
    let validData;
    if (getData != null) {
      validData = (await JSON.parse(getData)) as dbData;
      setData(validData);
    } else {
      setIsvisible(true);
      setData([] as dbData);
    }
    setGrade(type);
  };
  const play = async (item: dbItem) => {
    const music = {
      url: `asset:/files/_${item?.Word}.mp3`,
      title: item.Word,
      artist: 'eFlashApps',
      artwork: `asset:/files/_${item?.Word}.mp3`,
      duration: 0,
    };
    await player([music]);
  };
  const dispatch = useDispatch();
  useEffect(() => {
    const handleBackButton = () => {
      resetPlayer();
      dispatch({
        type: 'sightwords/resetbackSound',
      });
      navigation.reset({index: 0, routes: [{name: 'home'}]});
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackButton,
    );

    return () => {
      backHandler.remove();
    };
  }, []);
  const handleonModal = (visible: boolean) => {
    setIsvisible(visible);
  };
  return (
    <ImageBackground
      resizeMode="stretch"
      source={require('../../asset/images/pwbg.png')}
      style={styles.container}>
      <MyModal
        isVisible={isVisible}
        onPress={handleonModal}
        txt="Pratice again list for difficult words. Add words to list from
              Word by making them Red!"
      />
      <View style={styles.practiImg2}>
        <Image
          style={styles.img}
          resizeMode="contain"
          source={require('../../asset/images/practiceWord.png')}
        />
      </View>
      <View style={styles.practiImg}>
        <ImageBackground
          style={styles.img}
          resizeMode="contain"
          source={require('../../asset/images/greenbtn.png')}>
          <Text
            style={{
              fontSize: widthPrecent(6),
              fontWeight: 'bold',
              color: 'black',
            }}>
            Practice
          </Text>
        </ImageBackground>
      </View>
      <View style={styles.prePrimary}>
        <TouchableOpacity
          onPress={() => {
            getDataWithGrade('gradeA');
          }}
          style={styles.prePrimaryBtn}>
          <Image
            style={styles.img}
            resizeMode="contain"
            source={
              grade == 'gradeA'
                ? require('../../asset/images/grade1selected.png')
                : require('../../asset/images/grrade1.png')
            }
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            getDataWithGrade('gradeB');
          }}
          style={styles.prePrimaryBtn}>
          <Image
            style={styles.img}
            resizeMode="contain"
            source={
              grade == 'gradeB'
                ? require('../../asset/images/grade2selected.png')
                : require('../../asset/images/grade2.png')
            }
          />
        </TouchableOpacity>
      </View>
      {data && data?.length > 0 ? (
        <View style={styles.listContainer}>
          <FlatList
            data={data}
            keyExtractor={item => item.ID.toString()}
            renderItem={({item, index}) => (
              <View style={styles.list}>
                <Text style={styles.listtxt}>{item.Word}</Text>
                <TouchableOpacity
                  onPress={() => play(item)}
                  style={styles.adioBtn}>
                  <Image
                    style={styles.img}
                    resizeMode="contain"
                    source={require('../../asset/images/speaker01.png')}
                  />
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      ) : null}
      <TouchableOpacity
        onPress={() => {
          !IAP?.hasPurchased && showAdd();
          navigation.reset({index: 0, routes: [{name: 'home'}]});
        }}
        style={[styles.home, IAP?.hasPurchased && {bottom: 5}]}>
        <Image
          style={styles.img}
          source={require('../../asset/images/hmbtn.png')}
        />
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

export default Practice;
