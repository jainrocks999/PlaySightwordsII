import {
  Alert,
  BackHandler,
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {StackScreenProps} from '@react-navigation/stack';
import {StackNavigationParams} from '../../components/navigation';
import styles from './styles';
import Header from '../../components/Header';
import {useDispatch, useSelector} from 'react-redux';
import {rootState} from '../../redux';
import {FlatList} from 'react-native-gesture-handler';
import {dbData, dbItem} from '../../types';
import player from '../../utils/player';
import rightSound from '../../utils/rightSound';
import pickRandomOptions from '../../utils/randomotions';
import * as Animatable from 'react-native-animatable';
import resetPlayer from '../../utils/resetPlayer';
import MyModal from '../../components/Modal';
import showAdd, {Addsid} from '../../utils/ads';
import {GAMBannerAd, BannerAdSize} from 'react-native-google-mobile-ads';
import {IAPContext} from '../../Context';
type Props = StackScreenProps<StackNavigationParams, 'memory'>;

const Memory: React.FC<Props> = ({navigation}) => {
  const IAP = useContext(IAPContext);
  const data = useSelector((state: rootState) => state.data.dbData);
  const [isHard, setIsHard] = useState(false);
  const [zoom, setZoom] = useState('zoomIn');
  const delay = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };
  const backSound = useSelector((state: rootState) => state.data.backSound);
  const createDuplicate = (array: dbData) => {
    const duplicateArray = array.flatMap(item => [item, item]);
    return duplicateArray;
  };
  const [count, setCount] = useState(1);
  const [options, setOptions] = useState<dbData>([]);
  useEffect(() => {
    setOptions(
      pickRandomOptions(
        createDuplicate([...pickRandomOptions([...data], isHard ? 6 : 3)]),
        isHard ? 12 : 6,
      ),
    );
  }, [data]);
  const [selected, setSelected] = useState<dbItem>();
  const [selectedeIndex, setSelectedIndex] = useState<number[]>([]);
  const [righIndex, setRinghtIndex] = useState<number[]>([]);
  const [cloud, setCloud] = useState<number[]>([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const praisedItem = async (
    item: dbItem,
    index: number,
    prevArray: number[],
  ) => {
    setIsDisabled(true);
    const music = {
      url: `asset:/files/_${item.Word}.mp3`,
      title: item.Word,
      artist: 'eFlashApps',
      artwork: `asset:/files/_${item.Word}.mp3`,
      duration: 0,
    };

    setSelectedIndex([index]);
    setSelected(item);
    if (cloud.length < 2) {
      setCloud([...cloud, index]);
    }

    if (selected?.ID == item.ID) {
      setCount(prev => prev + 1);
      if ([...righIndex, index, ...prevArray].length >= options.length) {
        player([rightSound[6]]);
        await delay(2000);
        let random = pickRandomOptions(
          createDuplicate([...pickRandomOptions([...data], isHard ? 6 : 3)]),
          isHard ? 12 : 6,
        );
        setOptions(random);
        setIsDisabled(false);
        setRinghtIndex([]);
        setSelectedIndex([]);
        setCloud([]);
      } else {
        const right = pickRandomOptions(rightSound, 1);
        await player(right);
        await delay(500);
        setCloud([]);
        setRinghtIndex([...righIndex, index, ...prevArray]);
        setSelected({} as dbItem);
        setSelectedIndex([]);
      }
    } else {
      await player([music]);
      if ([...cloud, index].length >= 2) {
        await delay(500);
        setCloud([]);
        setSelected({} as dbItem);
        setCount(prev => prev + 1);
      }
    }
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
  useEffect(() => {
    if (count % 15 == 0) {
      setCount(1);
      !IAP?.hasPurchased && showAdd();
    }
  }, [count]);
  const [visible, setIsvisible] = useState(false);
  const handleLevel = async () => {
    if (!isDisabled) {
      setZoom('zoomOut');
      await delay(500);
      let random = pickRandomOptions(
        createDuplicate([...pickRandomOptions([...data], !isHard ? 6 : 3)]),
        !isHard ? 12 : 6,
      );
      setOptions(random);
      setIsHard(!isHard);
      !IAP?.hasPurchased && showAdd();
      setZoom('zoomIn');
    } else {
      setIsvisible(true);
    }
  };
  return (
    <ImageBackground
      style={styles.container}
      resizeMode="stretch"
      source={require('../../asset/images/a1.png')}>
      <MyModal
        isVisible={visible}
        onPress={(value: boolean) => {
          setIsvisible(value);
        }}
        txt="You cannot change levels until all your answers are correct."
      />
      <Animatable.View animation={zoom} style={styles.container}>
        <Header
          isRightDisabled={false}
          page="find"
          isMuted
          onLeftPress={() => {
            dispatch({
              type: 'sightwords/backSound',
              payload: {...backSound, memory: true},
            });
            navigation.navigate('setting');
          }}
          disabled
          onRightPress={async () => {
            handleLevel();
          }}
          isHard={isHard}
          onCenterPress={() => {
            null;
          }}
        />
        <View style={styles.cardContainer}>
          {!isHard ? (
            <FlatList
              key={'-'}
              data={options}
              keyExtractor={(item, index) => index.toString()}
              numColumns={2}
              renderItem={({item, index}) => (
                <TouchableOpacity
                  onPress={() => praisedItem(item, index, selectedeIndex)}
                  disabled={
                    selectedeIndex.includes(index) || righIndex.includes(index)
                  }
                  style={styles.card}>
                  {!righIndex.includes(index) ? (
                    <>
                      {!cloud.includes(index) ? (
                        <Image
                          resizeMode="contain"
                          source={require('../../asset/images/cloudsmall.png')}
                          style={styles.optionImage}
                        />
                      ) : null}

                      <Text
                        style={[
                          styles.txt,
                          {color: righIndex.includes(index) ? 'blue' : 'black'},
                        ]}>
                        {item.Word}
                      </Text>
                    </>
                  ) : null}
                </TouchableOpacity>
              )}
            />
          ) : (
            <FlatList
              key={'#'}
              data={options}
              keyExtractor={(item, index) => index.toString()}
              numColumns={3}
              renderItem={({item, index}) => (
                <TouchableOpacity
                  onPress={() => praisedItem(item, index, selectedeIndex)}
                  disabled={
                    selectedeIndex.includes(index) || righIndex.includes(index)
                  }
                  style={styles.card2}>
                  {!righIndex.includes(index) ? (
                    <>
                      {!cloud.includes(index) ? (
                        <Image
                          resizeMode="contain"
                          source={require('../../asset/images/cloudsmall.png')}
                          style={styles.optionImage}
                        />
                      ) : null}

                      <Text
                        style={[
                          styles.txt,
                          {color: righIndex.includes(index) ? 'blue' : 'black'},
                        ]}>
                        {item.Word}
                      </Text>
                    </>
                  ) : null}
                </TouchableOpacity>
              )}
            />
          )}
        </View>
        <TouchableOpacity
          onPress={() => navigation.reset({index: 0, routes: [{name: 'home'}]})}
          style={styles.homeContainer}>
          <Image
            style={styles.home}
            resizeMode="contain"
            source={require('../../asset/images/hmbtn.png')}
          />
        </TouchableOpacity>
      </Animatable.View>
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

export default Memory;
