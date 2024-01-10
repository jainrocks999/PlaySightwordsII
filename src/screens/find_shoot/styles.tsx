import {StyleSheet} from 'react-native';
import {
  heightPercent as hp,
  widthPrecent as wp,
} from '../../utils/ResponsiveScreen';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  somecontainer: {
    height: hp(20),
    width: wp(48),
  },
  cloudContainer: {
    height: hp(10),
    width: '100%',
    position: 'absolute',
    marginTop: wp(3),
    zIndex: 1,
  },
  txt: {
    fontSize: wp(8),
    color: 'black',
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  cloud: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    position: 'absolute',
    zIndex: 1,
    height: hp(55),
    width: wp(100),
    alignSelf: 'center',
  },
  boy: {
    height: hp(25),
    position: 'absolute',
    bottom: hp(5),
    left: wp(5),
  },
  home: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeBtn: {
    position: 'absolute',
    right: wp(-2),
    bottom: hp(15.8),
    height: hp(12),
    width: wp(35),
  },
  btn: {
    height: hp(7),
    width: wp(40),
    alignSelf: 'flex-end',
    marginRight: wp(2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn2: {
    alignSelf: 'center',
    marginRight: wp(2),
    height: wp(16),
    width: wp(16),
  },
});
