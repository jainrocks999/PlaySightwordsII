import TrackPlayer, {AddTrack} from 'react-native-track-player';
import {setupPlayer} from './Setup';
export default async (array: AddTrack[]) => {
  const isSetup = await setupPlayer();
  if (isSetup) {
    await TrackPlayer.reset();
    await TrackPlayer.add(array);
    await TrackPlayer.play();
  }
};
