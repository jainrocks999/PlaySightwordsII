import { Platform } from "react-native";
import RNFS from 'react-native-fs'
 export const  path = Platform.select({
    android: 'asset:/files/',
    ios: RNFS.MainBundlePath + '/files/',
  });