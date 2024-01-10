import {
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  Alert,
  AppState,
  AppStateStatus,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Header from '../../components/Header';
import styles from './styles';
import {FlatList} from 'react-native-gesture-handler';
import homedata from '../../utils/homedata';
import type {StackScreenProps} from '@react-navigation/stack';
import type {StackNavigationParams} from '../../components/navigation';
import {useSelector} from 'react-redux';
import {rootState} from '../../redux';
import player from '../../utils/player';
import resetPlayer from '../../utils/resetPlayer';
import {useIsFocused} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TrackPlayer from 'react-native-track-player';
type Props = StackScreenProps<StackNavigationParams, 'home'>;
const Home: React.FC<Props> = ({navigation}) => {
  const [muted, setMuted] = useState(false);
  const page = useSelector((state: rootState) => state.data.page);
  const data = useSelector((state: rootState) =>
    state.data.dbData
      .map(item => {
        const speling_name = `_${item.Word}_spelled.mp3`;
        const music = {
          url: `asset:/files/_${item?.Word}.mp3`,
          title: item.Word,
          artist: 'eFlashApps',
          artwork: `asset:/files/_${item?.Word}.mp3`,
          duration: 0,
        };
        const spelling = {
          url: `asset:/files/${speling_name}`,
          title: item?.Word,
          artist: 'eFlashApps',
          artwork: `asset:/files/${item?.Word}`,
          duration: 0,
        };
        return [music, spelling];
      })
      .flat(),
  );
  const sounds = [
    {
      url: `asset:/files/kids_music_2.wav`,
      title: 'kidsSound',
      artist: 'eFlashApps',
      artwork: `asset:/files/kids_music_2.wav`,
      duration: 0,
    },
    ...data,
  ];
  useEffect(() => {
    playSound();
  }, [muted]);
  const getMuted = async () => {
    const getsMuted = await AsyncStorage.getItem('muted');
    const validMuted: boolean =
      getsMuted == null ? true : JSON.parse(getsMuted);
    if (muted != null) {
      setMuted(validMuted);
    }
  };
  useEffect(() => {
    getMuted();
  }, []);
  const playSound = async () => {
    muted ? await player(sounds) : await resetPlayer();
  };
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const handleStateChange = async (nextState: AppStateStatus) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextState == 'active'
      ) {
        if (page == 'home') {
          playSound();
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
  const handleonMusic = async () => {
    await AsyncStorage.setItem('muted', JSON.stringify(!muted));
    setMuted(!muted);
  };
  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.backImage}
        source={require('../../asset/images/newmainbg.png')}
        resizeMode="stretch">
        <Header
          page=""
          disabled
          onLeftPress={() => {
            handleonMusic();
          }}
          isMuted={muted}
          isHard={false}
          onCenterPress={() => null}
          onRightPress={() => {
            navigation.navigate('setting');
          }}
        />
        <View style={styles.imagescontainer}>
          <FlatList
            data={homedata}
            keyExtractor={item => item.id}
            renderItem={({item, index}) => (
              <TouchableOpacity
                onPress={async () => {
                  await resetPlayer();
                  let valid = item.page as keyof StackNavigationParams;
                  navigation.navigate(valid);
                }}
                style={styles.listImage}>
                <Image
                  style={styles.image}
                  source={item.path}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            )}
          />
        </View>
        <View style={styles.bottumImage}>
          <Image
            style={styles.image}
            source={require('../../asset/images/eflashappipad.png')}
          />
        </View>
      </ImageBackground>
    </View>
  );
};

export default Home;
