import TrackPlayer from 'react-native-track-player';
import {setupPlayer} from './Setup';

export default async () => {
  const isSetup = await setupPlayer();
  if (isSetup) {
    await TrackPlayer.reset();
  }
};
