import {AppState, AppStateStatus} from 'react-native';
import resetPlayer from './resetPlayer';
export const handleAppStateChange = async (
  page: string,
  appState: {current: string},
  playSound: () => void,
) => {
  const handleStateChange = async (nextState: AppStateStatus) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextState === 'active'
    ) {
      if (page === 'home') {
        playSound();
      }
    }

    if (nextState === 'background') {
      console.log('gone background');
      await resetPlayer();
    }
  };

  const unsubscribe = AppState.addEventListener('change', handleStateChange);

  return () => {
    unsubscribe.remove();
  };
};
