import {StyleSheet} from 'react-native';
import {
  heightPercent as hp,
  widthPrecent as wp,
} from '../../utils/ResponsiveScreen';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  listCotainer: {
    marginTop: hp(5),
    alignItems: 'center',
  },
  card: {
    height: wp(22),
    width: wp(22),
    marginHorizontal: wp(1),
    marginVertical: wp(1),
    borderRadius: hp(1.5),
    overflow: 'hidden',
  },
  btn: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  txt: {
    fontSize: wp(6),
    color: 'black',
    fontWeight: '500',
  },
  countCotainer: {
    flexDirection: 'row',
    width: '70%',
    justifyContent: 'space-between',
    alignSelf: 'center',
    marginTop: hp(4),
  },
  counts: {alignItems: 'center', justifyContent: 'center'},
  txt2: {
    fontSize: wp(5),
    color: 'black',
    marginTop: hp(1),
  },
  img: {
    height: hp(2.8),
    width: wp(20),
  },
  img2: {
    height: hp(1.8),
    width: wp(15),
  },
  animated: {
    alignSelf: 'center',
    position: 'absolute',
    zIndex: 1,
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clock: {
    height: wp(23),
    width: wp(22),
    position: 'absolute',
    bottom: hp(15),
    left: wp(40),
    zIndex: 1,
  },
});
