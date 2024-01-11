import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
  Animated,
  AppState,
  AppStateStatus,
  FlatList,
  BackHandler,
} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {StackNavigationParams} from '../../components/navigation';
import styles from './styles';
import Header from '../../components/Header';
import {useDispatch, useSelector} from 'react-redux';
import type {rootState} from '../../redux';

import {widthPrecent, widthPrecent as wp} from '../../utils/ResponsiveScreen';
import {dbData} from '../../types';
import {setupPlayer} from '../../utils/Setup';
import TrackPlayer, {AddTrack} from 'react-native-track-player';
import rightSound from '../../utils/rightSound';
import player from '../../utils/player';
import pickRandomOptions from '../../utils/randomotions';
import {heightPercent as hp} from '../../utils/ResponsiveScreen';
import * as Animatable from 'react-native-animatable';
import resetPlayer from '../../utils/resetPlayer';
import MyModal from '../../components/Modal';
const AnimatedFlatlist = Animated.createAnimatedComponent(
  FlatList as new () => FlatList<dbData>,
);
type Props = StackScreenProps<StackNavigationParams, 'find'>;
const Find: React.FC<Props> = ({navigation}) => {
  const page = useSelector((state: rootState) => state.data.page);
  const backSound = useSelector((state: rootState) => state.data.backSound);
  const data = useSelector((state: rootState) => state.data.dbData);
  const [pickImage, setPickImage] = useState('');
  const [rightAns, setRightAns] = useState(-1);
  const [isHard, setIsHard] = useState(false);
  const [word, setWord] = useState('');
  const [zoom, setZoom] = useState('zoomIn');
  const [options, setOptions] = useState<dbData>([]);
  useEffect(() => {
    setOptions(pickRandomOptions([...data], isHard ? 5 : 3));
  }, [data]);
  const animatedValue = useRef(new Animated.Value(0)).current;

  const translateX = animatedValue.interpolate({
    inputRange: [-10, 0, 10],
    outputRange: [-5, 0, 5],
  });
  const [changeDIsable, setChangeDisabled] = useState(false);
  const [set, setSet] = useState('zoomOut');
  const timeRef = useRef<NodeJS.Timeout>();
  const delay = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };
  const askQuestion = async (option: dbData) => {
    const rightIndex = Math.floor(Math.random() * 3);
    const sound_name = `_${option[rightIndex].Word}.mp3`;
    const sound = [
      {
        url: 'asset:/files/clickon.mp3',
        title: option[rightIndex].Word,
        artist: 'eFlashApps',
        artwork: `asset:/files/${sound_name}`,
        duration: 0,
      },
      {
        url: `asset:/files/${sound_name}`,
        title: option[rightIndex].Word,
        artist: 'eFlashApps',
        artwork: `asset:/files/${sound_name}`,
        duration: 0,
      },
    ];
    setWord(option[rightIndex].Word);
    setRightAns(rightIndex);
    const isSetup = await setupPlayer();
    if (isSetup) {
      await player(sound);
    }
  };
  const repeate = () => {
    const sound_name = `_${options[rightAns]?.Word}.mp3`;
    const sound = {
      url: `asset:/files/${sound_name}`,
      title: options[rightAns]?.Word,
      artist: 'eFlashApps',
      artwork: `asset:/files/${sound_name}`,
      duration: 0,
    };
    player([sound]);
  };

  useEffect(() => {
    !backSound.find ? repeate() : null;
  }, [backSound]);
  const [disabled, setDiSabled] = useState<number[]>([]);
  const presseOption = async (index: number, array: dbData) => {
    setChangeDisabled(true);
    let gunsoud = {
      url: require('../../asset/sounds/gun.mp3'), //`asset:/files/clickon.mp3`,
      title: 'gun',
      artist: 'eFlashApps',
      artwork: `asset:/files/gun.mp3`,
      duration: 0,
    };
    let strings = {
      url: require('../../asset/sounds/string.wav'), //`asset:/files/clickon.mp3`,
      title: 'gun',
      artist: 'eFlashApps',
      artwork: `asset:/files/string.wav`,
      duration: 0,
    };

    await player([gunsoud]);
    await delay(300);
    if (index == rightAns) {
      setDiSabled(!isHard ? [0, 1, 2] : [0, 1, 2, 3, 4, 5]);

      setPickImage(require('../../asset/images/bang.png'));
      await player(pickRandomOptions(rightSound, 5)[3]);
      const timeRefs = setTimeout(() => {
        let remdomData = pickRandomOptions([...data], isHard ? 5 : 3);
        Animated.loop(
          Animated.sequence([
            Animated.timing(animatedValue, {
              toValue: 10,
              duration: 20,
              useNativeDriver: true,
            }),
            Animated.timing(animatedValue, {
              toValue: -10,
              duration: 10,
              useNativeDriver: true,
            }),
            Animated.timing(animatedValue, {
              toValue: 0,
              duration: 10,
              useNativeDriver: true,
            }),
          ]),
          {
            iterations: 5,
          },
        ).start(() => {
          setOptions(remdomData);
          setSet('zoomOut');
          setChangeDisabled(false);
          animatedValue.setValue(0);
          setDiSabled([]);
        });

        setPickImage('');
      });
      timeRef.current = timeRefs;
    } else {
      setPickImage(require('../../asset/images/cross.png'));
      await player([strings]);
      await delay(1200);
      setPickImage('');
    }
  };

  useEffect(() => {
    askQuestion([...options]);
    setSet('zoomIn');
  }, [options]);
  const dispatch = useDispatch();
  const appState = useRef(AppState.currentState);
  useEffect(() => {
    const handleStateChange = async (nextState: AppStateStatus) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextState == 'active'
      ) {
        if (page == 'find') {
          repeate();
        }
      }
      appState.current = nextState;
      if (appState.current === 'background') {
        console.log('gone background');

        await resetPlayer();
      }
    };
    const unsubscribe = AppState.addEventListener('change', handleStateChange);

    return () => {
      unsubscribe.remove();
    };
  }, []);
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
  const [isVisible, setIsvisible] = useState(false);
  const handleLevle = async () => {
    if (!changeDIsable) {
      setZoom('zoomOut');
      await delay(500);
      setOptions(pickRandomOptions([...data], !isHard ? 5 : 3));
      setIsHard(!isHard);

      setZoom('zoomIn');
    } else {
      setIsvisible(true);
    }
  };
  return (
    <ImageBackground
      source={require('../../asset/images/a5.png')}
      style={styles.container}
      resizeMode="stretch">
      <MyModal
        isVisible={isVisible}
        onPress={(value: boolean) => setIsvisible(value)}
        txt="You cannot change levels until  your answer is correct."
      />
      <Animatable.View animation={zoom} style={styles.container}>
        <Header
          page="find"
          isMuted={false}
          onLeftPress={async () => {
            await resetPlayer();
            dispatch({
              type: 'sightwords/backSound',
              payload: {...backSound, find: true},
            });

            navigation.navigate('setting');
          }}
          isRightDisabled={false}
          isHard={isHard}
          onRightPress={async () => {
            handleLevle();
          }}
          disabled={false}
          onCenterPress={() => null}
        />
        <View style={[styles.listContainer, !isHard && {paddingTop: hp(7)}]}>
          {pickImage != '' ? (
            <Image
              resizeMode="contain"
              style={styles.image}
              source={pickImage}
            />
          ) : null}
          <AnimatedFlatlist
            data={options}
            keyExtractor={item => item.ID.toString()}
            numColumns={2}
            style={{transform: [{translateX}]}}
            renderItem={({item, index}) => (
              <View
                style={[
                  styles.somecontainer,
                  {
                    top: index % 2 == 1 ? wp(20) : 0,
                    left: index % 2 == 0 ? wp(6) : 0,
                  },
                ]}>
                <TouchableOpacity
                  onPress={() => presseOption(index, [...options])}
                  style={[styles.cloudContainer]}
                  disabled={disabled.includes(index)}>
                  <ImageBackground
                    style={styles.cloud}
                    resizeMode="stretch"
                    source={require('../../asset/images/whitecloud.png')}>
                    <Animatable.Text
                      animation={set}
                      duration={1000}
                      style={[styles.txt]}>
                      {item.Word}
                    </Animatable.Text>
                  </ImageBackground>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>

        <TouchableOpacity
          onPress={() => {
            repeate();
          }}
          style={[!isHard ? styles.btn : styles.btn2]}>
          <ImageBackground
            resizeMode="contain"
            style={styles.home}
            source={
              !isHard
                ? require('../../asset/images/bgclick.png')
                : require('../../asset/images/repeat.png')
            }>
            {!isHard ? (
              <Text
                style={[
                  styles.txt,
                  {color: 'white', fontSize: widthPrecent(6)},
                ]}>
                {options[rightAns]?.Word}
              </Text>
            ) : null}
          </ImageBackground>
        </TouchableOpacity>

        <Image
          style={styles.boy}
          resizeMode="contain"
          source={require('../../asset/images/boy2.png')}
        />

        <TouchableOpacity
          onPress={async () => {
            await resetPlayer();
            dispatch({
              type: 'sightwords/resetbackSound',
            });
            navigation.reset({index: 0, routes: [{name: 'home'}]});
          }}
          style={styles.homeBtn}>
          <Image
            style={styles.home}
            resizeMode="contain"
            source={require('../../asset/images/hmbtn.png')}
          />
        </TouchableOpacity>
      </Animatable.View>
    </ImageBackground>
  );
};

export default Find;
