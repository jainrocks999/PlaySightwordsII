import {StyleSheet} from 'react-native';
import {
  heightPercent as hp,
  widthPrecent as wp,
} from '../../utils/ResponsiveScreen';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  headercontainer: {
    paddingHorizontal: wp(2),
    paddingTop: hp(2),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerItem: {
    justifyContent: 'center',
    height: hp(6),
    width: '33%',
  },
  icon: {
    height: '100%',
    width: hp(6),
    alignSelf: 'flex-start',
  },
  title: {
    height: hp(5),
    width: wp(45),
  },
  textContainer: {
    height: hp(40),
    alignItems: 'center',
    justifyContent: 'center',
  },
  txt: {
    fontSize: wp(30),
    fontFamily: 'Doctor Soos Bold 1.1',
    color: 'black',
  },
  btncontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: wp(97),
    alignSelf: 'center',
  },
  btn: {
    height: '100%',
    width: '100%',
  },
  singleBtncontainer: {
    height: hp(12),
    width: wp(30),
  },
  singleBtncontainer2: {
    height: hp(7),
    width: hp(7),
  },
  homeIcone: {
    height: hp(12),
    width: hp(12),
    position: 'absolute',
    bottom: hp(16),
    right: wp(0),
    zIndex: 1,
  },
});
