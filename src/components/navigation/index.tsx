import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Home from '../../screens/home';
import Splash from '../../screens/splash';
import Grade from '../../screens/Grade';
import Word from '../../screens/word_tour';
import Find from '../../screens/find_shoot';
import Memory from '../../screens/memory_game';
import Bingo from '../../screens/bingo_game';
import Practice from '../../screens/practice_words';
import Setting from '../../screens/seetings';
import {useDispatch} from 'react-redux';
export type StackNavigationParams = {
  splash: undefined;
  home: undefined;
  grade: undefined;
  word: undefined;
  find: undefined;
  memory: undefined;
  bingo: undefined;
  practice: undefined;
  setting: undefined;
};
const Navigation = () => {
  const dispatch = useDispatch();
  const Stack = createStackNavigator<StackNavigationParams>();
  return (
    <NavigationContainer
      onStateChange={state => {
        const name = state?.routes[state.index].name;
        dispatch({
          type: 'sightwords/setPageChange',
          payload: name,
        });
      }}>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="splash">
        <Stack.Screen name="home" component={Home} />
        <Stack.Screen name="splash" component={Splash} />
        <Stack.Screen name="grade" component={Grade} />
        <Stack.Screen name="word" component={Word} />
        <Stack.Screen name="memory" component={Memory} />
        <Stack.Screen name="bingo" component={Bingo} />
        <Stack.Screen name="practice" component={Practice} />
        <Stack.Screen name="setting" component={Setting} />
        <Stack.Screen name="find" component={Find} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default Navigation;
