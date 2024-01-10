import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  AppState,
  AppStateStatus,
  BackHandler,
} from 'react-native';
import styles from './styles';
import type {StackScreenProps} from '@react-navigation/stack';
import {StackNavigationParams} from '../../components/navigation';
import Header from '../../components/Header/header';
import {widthPrecent as wp} from '../../utils/ResponsiveScreen';
import {useDispatch, useSelector} from 'react-redux';
import {rootState} from '../../redux';
import {setupPlayer} from '../../utils/Setup';
import resetPlayer from '../../utils/resetPlayer';
import {dbData, dbItem} from '../../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TrackPlayer from 'react-native-track-player';
type Props = StackScreenProps<StackNavigationParams, 'word'>;
type music = {
  url: string;
  title: string;
  artist: string;
  artwork: string;
  duration: number;
};
const Word: React.FC<Props> = ({navigation}) => {
  const grade = useSelector((state: rootState) => state.data.grade);
  const random = useSelector((state: rootState) => state.data.random);
  const page = useSelector((state: rootState) => state.data.page);
  const datas = useSelector((state: rootState) => state.data.dbData);
  const [data, setData] = useState<dbData>(datas);
  const backSound = useSelector((state: rootState) => state.data.backSound);
  const [count, setCount] = useState<number>(0);
  const [words, setWords] = useState<string>('');
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const [delays, setDealy] = useState<number>(500);
  useEffect(() => {
    const clear = setTimeout(() => {
      setCount(0);
      const sortedData = datas
        .slice()
        .sort((a, b) =>
          a.Word.toLowerCase().localeCompare(b.Word.toLowerCase()),
        );
      const randomlySortedData = data.slice().sort(() => Math.random() - 0.5);
      setData(random.random ? randomlySortedData : sortedData);
    }, 500);
    return () => {
      clearTimeout(clear);
    };
  }, [random, datas]);

  useEffect(() => {
    const clear = setTimeout(() => {
      setWords(data[0].Word);
    }, 500);
    return () => {
      clearTimeout(clear);
    };
  }, [data]);
  const [newWord, setNewWord] = useState('');
  const [music, setMusic] = useState<music[]>([]);
  const [spred_word, setWordToShow] = useState('');
  useEffect(() => {
    setWordToShow('');
    const clear = setTimeout(() => {
      showData();
      setDealy(200);
    }, delays);
    return () => {
      clearTimeout(clear);
    };
  }, [count, data]);
  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(timeoutId => {
      clearTimeout(timeoutId);
    });
    timeoutsRef.current = [];
  };
  const stopSoundAndCleartime = async () => {
    clearAllTimeouts();
    const times = setTimeout(async () => {
      await resetPlayer();
    }, 700);
    return () => {
      clearTimeout(times);
    };
  };

  const loop = (characters: string[]) => {
    clearAllTimeouts();

    const newTimeouts: any = [];
    setWordToShow('');
    characters.forEach((item, index) => {
      const timeoutId: NodeJS.Timeout = setTimeout(() => {
        setWordToShow(prevWord => prevWord + item);
      }, index * 700);
      newTimeouts.push(timeoutId);
      timeoutsRef.current.push(timeoutId);
    });
  };
  const playsound = async (arr: music[], characters: string[]) => {
    clearAllTimeouts();
    await TrackPlayer.reset();
    await TrackPlayer.add(arr[0]);
    await TrackPlayer.play();
    const ref = setTimeout(async () => {
      await TrackPlayer.reset();
      await TrackPlayer.add(arr[1]);
      await TrackPlayer.play();
      loop(characters);
    }, 1700);
    timeoutsRef.current.push(ref);
  };

  const dispatch = useDispatch();

  const showData = async () => {
    setBackoundImage(prev => !prev);
    try {
      clearAllTimeouts();
      const isSetup = await setupPlayer();
      const word = data[count].Word;
      const music_name = `_${word}.mp3`;
      const speling_name = `_${word}_spelled.mp3`;
      const music = {
        url: `asset:/files/${music_name}`,
        title: word,
        artist: 'eFlashApps',
        artwork: `asset:/files/${music_name}`,
        duration: 0,
      };
      const spelling = {
        url: `asset:/files/${speling_name}`,
        title: word,
        artist: 'eFlashApps',
        artwork: `asset:/files/${speling_name}`,
        duration: 0,
      };
      const arr = [music, spelling];
      setMusic(arr);
      setWords(word);
      setNewWord(word);
      if (isSetup) {
        await playsound(arr, [...word]);
      }
    } catch (error) {
      console.error('Error in showData:', error);
    }
  };
  const [backgroundImage, setBackoundImage] = useState(false);

  useEffect(() => {
    setWordToShow('');
    !backSound.word ? playsound(music, [...newWord]) : null;
  }, [backSound]);

  const appState = useRef(AppState.currentState);
  useEffect(() => {
    const handleStateChange = async (nextState: AppStateStatus) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextState == 'active'
      ) {
        if (page == 'word') {
          await playsound(music, [...newWord]);
        }
      }
      appState.current = nextState;
      if (appState.current === 'background') {
        await resetPlayer();
      }
    };

    const unsubscribe = AppState.addEventListener('change', handleStateChange);

    return () => {
      unsubscribe.remove();
    };
  }, []);
  const [addedPractice, setAddPractice] = useState<dbData>([]);
  useEffect(() => {
    getPracticeItem();
  }, []);

  const getPracticeItem = async () => {
    const practiceItemsStr = await AsyncStorage.getItem(
      grade === 'tblWord' ? 'gradeA' : 'gradeB',
    );

    const practiceItems: dbData = (await JSON.parse(
      practiceItemsStr !== null ? practiceItemsStr : '[]',
    )) as dbData;
    setAddPractice(practiceItems);
  };

  const setForPractice = async (item: dbItem) => {
    const practiceItems: dbData = [...addedPractice];

    const isItemPresent = practiceItems.some(
      practiceItem => practiceItem.ID === item.ID,
    );

    let updatedItems: dbData;

    if (isItemPresent) {
      updatedItems = practiceItems.filter(
        practiceItem => practiceItem.ID !== item.ID,
      );
    } else {
      updatedItems = [...practiceItems, item];
    }

    await AsyncStorage.setItem(
      grade === 'tblWord' ? 'gradeA' : 'gradeB',
      JSON.stringify(updatedItems),
    );

    setAddPractice(updatedItems);
  };
  const getRed = () => {
    return addedPractice.some(item => item.ID == data[count].ID);
  };
  useEffect(() => {
    const handleBackButton = () => {
      clearAllTimeouts();
      // dispatch({
      //   type: 'sightwords/resetbackSound',
      // });
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

  return (
    <ImageBackground
      source={
        backgroundImage
          ? require('../../asset/images/a6.png')
          : require('../../asset/images/a4.png')
      }
      style={styles.container}
      resizeMode="stretch">
      <Header
        onLeftPress={async () => {
          setWordToShow('');
          await stopSoundAndCleartime();
          dispatch({
            type: 'sightwords/backSound',
            payload: {...backSound, word: true},
          });

          navigation.navigate('setting');
        }}
        practice={getRed()}
        onRightPress={() => {
          setForPractice(data[count]);
        }}
      />
      <View style={styles.textContainer}>
        <Text style={styles.txt}>{spred_word != '' ? spred_word : words}</Text>
        <Text
          style={[
            {
              fontSize: wp(5),
              position: 'absolute',
              bottom: 0,
              color: 'black',
              fontStyle: 'italic',
              fontWeight: '500',
            },
          ]}>
          {`${count + 1}/${data.length}`}
        </Text>
      </View>

      <View style={styles.btncontainer}>
        <TouchableOpacity
          onPress={() => {
            setWordToShow('');
            setCount(count - 1);
          }}
          disabled={count == 0 ? true : false}
          style={styles.singleBtncontainer}>
          <Image
            style={styles.btn}
            resizeMode="contain"
            source={
              count <= 0
                ? require('../../asset/images/leftdisable.png')
                : require('../../asset/images/lftbtn.png')
            }
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setWords(newWord);
            setWordToShow('');
            playsound(music, [...newWord]);
          }}
          style={styles.singleBtncontainer2}>
          <Image
            style={styles.btn}
            resizeMode="contain"
            source={require('../../asset/images/repeat.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setWordToShow('');
            setCount(count + 1);
          }}
          disabled={count + 1 == data.length ? true : false}
          style={styles.singleBtncontainer}>
          <Image
            style={styles.btn}
            resizeMode="contain"
            source={
              count + 1 == data.length
                ? require('../../asset/images/rightbtns.png')
                : require('../../asset/images/rightbtn.png')
            }
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={async () => {
          await clearAllTimeouts();

          navigation.reset({index: 0, routes: [{name: 'home'}]});
        }}
        style={styles.homeIcone}>
        <Image
          style={styles.btn}
          resizeMode="contain"
          source={require('../../asset/images/hmbtn.png')}
        />
      </TouchableOpacity>
    </ImageBackground>
  );
};

export default Word;
const myarray = ['raju', 'brade', 'deley'];
