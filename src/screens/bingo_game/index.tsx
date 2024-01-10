import {
  Image,
  ImageBackground,
  Animated,
  View,
  Text,
  TouchableOpacity,
  Button,
  AppState,
  AppStateStatus,
  BackHandler,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {StackScreenProps} from '@react-navigation/stack';
import {StackNavigationParams} from '../../components/navigation';
import styles from './styles';
import {useDispatch, useSelector} from 'react-redux';
import {rootState} from '../../redux';
import randomotions from '../../utils/randomotions';
import Header from '../../components/Header';
import {FlatList} from 'react-native-gesture-handler';
import {dbData} from '../../types';

import player from '../../utils/player';
import rightSound from '../../utils/rightSound';

import FastImage from 'react-native-fast-image';
import TrackPlayer from 'react-native-track-player';
import resetPlayer from '../../utils/resetPlayer';
type Props = StackScreenProps<StackNavigationParams, 'bingo'>;
const Bingo: React.FC<Props> = ({navigation}) => {
  const page = useSelector((state: rootState) => state.data.page);
  const backSound = useSelector((state: rootState) => state.data.backSound);
  const [seconds, setSeconds] = useState(0);
  const data = useSelector((state: rootState) => state.data.dbData);
  const [options, setOptions] = useState<dbData>([]);
  useEffect(() => {
    setOptions(randomotions(data, 16));
    resetGameState();
  }, [data]);

  const [incorrect, setIncorrect] = useState(0);
  const [rightAns, setRightAns] = useState(-1);
  const [rightAnsArr, setRightAnsArr] = useState<number[]>([]);
  const [update, setUpdate] = useState(false);
  const [selectedRowOrColumn, setSelectedRowOrColumn] = useState<number[]>([]);
  const [show, setshow] = useState(false);
  const [delaytime, setdelayTime] = useState(500);
  const [clickon, setCLickon] = useState(true);
  const delay = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  const secondanim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const clear = setTimeout(() => {
      askQuestion();
      setdelayTime(0);
    }, delaytime);
    return () => {
      clearTimeout(clear);
    };
  }, [update]);
  const getQuestion = () => {
    return new Promise<number>(resolve => {
      let index: number = Math.floor(Math.random() * 16);

      while (rightAnsArr.includes(index) && rightAnsArr.length < 16) {
        index = Math.floor(Math.random() * 16);
      }
      resolve(rightAnsArr.length < 16 ? index : -1);
    });
  };

  const askQuestion = async () => {
    const rightIndex = await getQuestion();
    const sound_name = `_${options[rightIndex]?.Word}.mp3`;
    const sound = [
      {
        url: 'asset:/files/clickon.mp3', //`asset:/files/clickon.mp3`,
        title: options[rightIndex]?.Word,
        artist: 'eFlashApps',
        artwork: `asset:/files/${sound_name}`,
        duration: 0,
      },
      {
        url: `asset:/files/${sound_name}`,
        title: options[rightIndex]?.Word,
        artist: 'eFlashApps',
        artwork: `asset:/files/${sound_name}`,
        duration: 0,
      },
    ];

    setRightAns(rightIndex);
    await player(clickon ? sound : [sound[1]]);
    setCLickon(false);
  };
  const isRowSelected = (rowIndex: number, array: number[]) => {
    return new Promise<boolean>(resolve => {
      const rowStartIndex = rowIndex * 4;
      const rowEndIndex = rowStartIndex + 4;

      for (let i = rowStartIndex; i < rowEndIndex; i++) {
        if (!array.includes(i)) {
          resolve(false);
        }
      }
      resolve(true);
    });
  };
  const isColumnSelected = (colIndex: number, array: number[]) => {
    return new Promise<boolean>(resolve => {
      for (let i = colIndex; i < 16; i += 4) {
        if (!array.includes(i)) {
          resolve(false);
        }
      }
      resolve(true);
    });
  };

  const isDiagonalSelected = (array: number[], direction: 'left' | 'right') => {
    return new Promise<boolean>(resolve => {
      let diagonalIndices: number[];

      if (direction === 'left') {
        diagonalIndices = [0, 5, 10, 15];
      } else if (direction === 'right') {
        diagonalIndices = [3, 6, 9, 12];
      } else {
        resolve(false);
        return;
      }

      for (let i = 0; i < diagonalIndices.length; i++) {
        if (!array.includes(diagonalIndices[i])) {
          resolve(false);
        }
      }

      resolve(true);
    });
  };

  const repeate = async (rightIndex: number) => {
    const sound_name = `_${options[rightIndex]?.Word}.mp3`;
    console.log(sound_name);

    const sound = [
      {
        url: `asset:/files/${sound_name}`,
        title: options[rightIndex]?.Word,
        artist: 'eFlashApps',
        artwork: `asset:/files/${sound_name}`,
        duration: 0,
      },
    ];
    await player(sound);
  };
  const checkRowColumnDiagonal = (array: number[]) => {
    return new Promise<number[]>(async resolve => {
      const rowArr: number[] = [];
      const colArr: number[] = [];
      let leftDiagonalArr: number[] = [];
      let rightDiagonalArr: number[] = [];

      const promises = [];

      for (let i = 0; i < 16; i++) {
        const row = Math.floor(i / 4);
        const col = i % 4;

        promises.push(
          isRowSelected(row, array).then(selected => {
            if (selected) rowArr.push(i);
          }),
        );

        promises.push(
          isColumnSelected(col, array).then(selected => {
            if (selected) colArr.push(i);
          }),
        );

        if (row === col) {
          promises.push(
            isDiagonalSelected(array, 'left').then(selected => {
              if (selected) leftDiagonalArr = [0, 5, 10, 15];
            }),
          );
        }

        if (col === 3 - row) {
          promises.push(
            isDiagonalSelected(array, 'right').then(selected => {
              if (selected) rightDiagonalArr = [3, 6, 9, 12];
            }),
          );
        }
      }

      await Promise.all(promises);

      resolve(
        rowArr.length >= 4
          ? rowArr
          : colArr.length >= 4
          ? colArr
          : leftDiagonalArr.length === 4
          ? leftDiagonalArr
          : rightDiagonalArr.length === 4
          ? rightDiagonalArr
          : [],
      );
    });
  };

  const Praised = async (index: number) => {
    const isRightAnswer = index == rightAns;

    if (isRightAnswer) {
      setRightAnsArr(prev => [...prev, index]);

      const array = await checkRowColumnDiagonal([...rightAnsArr, index]);

      if (array.length >= 4) {
        setshow(true);
        statrtAnimtion();
        setCLickon(true);
        setSelectedRowOrColumn(array);
        await player([rightSound[6]]);
        await delay(2500);
        setSelectedRowOrColumn([]);
        setOptions(randomotions(data, 16));
        resetGameState();
      } else if ([...rightAnsArr, index].length === 16) {
        await delay(1200);
        setOptions(randomotions(data, 16));
        resetGameState();
      } else {
        await player([rightSound[rightSound.length - 1]]);
        await delay(800);
        setUpdate(!update);
      }
    } else {
      setIncorrect(prev => prev + 1);
      await player([
        {
          url: 'asset:/files/string.wav',
          title: 'string',
          artist: 'eFlashApps',
          artwork: 'asset:/files/string.wav',
          duration: 0,
        },
      ]);

      await delay(800);
      repeate(rightAns);
    }
  };

  const resetGameState = () => {
    setRightAns(-1);
    setRightAnsArr([]);
    setUpdate(!update);
    setIncorrect(0);
    setSeconds(0);
  };
  useEffect(() => {
    !backSound.bingo ? repeate(rightAns) : null;
  }, [backSound]);
  useEffect(() => {
    const interval = setInterval(async () => {
      setSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds]);

  const statrtAnimtion = async () => {
    setshow(true);
    Animated.loop(
      Animated.sequence([
        Animated.timing(secondanim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(secondanim, {
          toValue: 0.5,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(secondanim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(secondanim, {
          toValue: 0.5,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(secondanim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(secondanim, {
          toValue: 0.5,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
    await delay(3500);
    setshow(false);
  };
  const dispatch = useDispatch();
  const appState = useRef(AppState.currentState);
  useEffect(() => {
    const handleStateChange = async (nextState: AppStateStatus) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextState == 'active'
      ) {
        if (page == 'bingo') {
          repeate(rightAns);
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
  return (
    <ImageBackground
      style={styles.container}
      source={require('../../asset/images/testbg.png')}
      resizeMode="stretch">
      <Header
        isMuted
        onCenterPress={() => {
          repeate(rightAns);
        }}
        onLeftPress={async () => {
          await TrackPlayer.reset();
          dispatch({
            type: 'sightwords/backSound',
            payload: {...backSound, bingo: true},
          });
          navigation.navigate('setting');
        }}
        isHard={false}
        disabled={false}
        onRightPress={async () => {
          await resetPlayer();
          dispatch({
            type: 'sightwords/resetbackSound',
          });
          navigation.reset({index: 0, routes: [{name: 'home'}]});
        }}
        page="bingo"
      />
      <View style={styles.listCotainer}>
        {show && (
          <Animated.View
            style={[
              {
                transform: [{scale: secondanim}],
              },
              styles.animated,
            ]}>
            <Image
              resizeMode="contain"
              style={{height: '40%', width: '40%', alignSelf: 'center'}}
              source={require('../../asset/images/horizontal.png')}
            />
          </Animated.View>
        )}

        <FlatList
          data={options}
          keyExtractor={item => item.ID.toString()}
          numColumns={4}
          renderItem={({item, index}) => (
            <TouchableOpacity
              onPress={() => Praised(index)}
              disabled={rightAnsArr.includes(index)}
              style={styles.card}>
              {!rightAnsArr.includes(index) ? (
                <ImageBackground
                  style={styles.btn}
                  source={require('../../asset/images/btnbg.png')}>
                  <Text style={styles.txt}>{item.Word}</Text>
                </ImageBackground>
              ) : selectedRowOrColumn.includes(index) ? (
                <FastImage
                  source={require('../../asset/images/gif2.gif')}
                  style={{height: '100%', width: '100%', opacity: 5}}
                />
              ) : (
                <FastImage
                  source={require('../../asset/images/gif.gif')}
                  style={{height: '100%', width: '100%', opacity: 5}}
                />
              )}
            </TouchableOpacity>
          )}
        />
      </View>

      <View style={styles.countCotainer}>
        <View style={styles.counts}>
          <Image
            style={styles.img}
            resizeMode="contain"
            source={require('../../asset/images/incorrect.png')}
          />
          <Text style={styles.txt2}>{incorrect}</Text>
        </View>
        <View style={styles.counts}>
          <Image
            resizeMode="contain"
            style={styles.img2}
            source={require('../../asset/images/time.png')}
          />
          <Text style={styles.txt2}>{seconds}</Text>
        </View>
      </View>
      <Image
        style={styles.clock}
        resizeMode="contain"
        source={require('../../asset/images/clock.png')}
      />
    </ImageBackground>
  );
};

export default Bingo;
