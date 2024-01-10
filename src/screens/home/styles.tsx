import {StyleSheet} from 'react-native';
import {
  heightPercent as hp,
  widthPrecent as wp,
} from '../../utils/ResponsiveScreen';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  backImage: {
    height: hp(100),
    width: wp(100),
  },
  imagescontainer: {
    marginTop: hp(7),
    marginLeft: wp(6),
  },
  image: {
    height: '100%',
    width: '100%',
  },
  listImage: {
    height: hp(7),
    width: wp(60),
    marginTop: hp(3.5),
  },
  bottumImage: {
    height: hp(5),
    width: wp(40),
    position: 'absolute',
    bottom: hp(15),
    left: wp(25),
  },
});
