import {Dimensions} from 'react-native';
const {height, width} = Dimensions.get('window');
export const heightPercent = (percent: number) => {
  return (height * percent) / 100;
};
export const widthPrecent = (percent: number) => {
  return (width * percent) / 100;
};
