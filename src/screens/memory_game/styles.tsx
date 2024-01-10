import {StyleSheet} from 'react-native';
import {
  heightPercent as hp,
  widthPrecent as wp,
} from '../../utils/ResponsiveScreen';

export default StyleSheet.create({
  container: {flex: 1},
  card: {
    height: hp(14),
    width: wp(42),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: wp(2),
    marginVertical: wp(1),
  },
  card2: {
    height: hp(10),
    width: wp(28),
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: wp(2),
    marginVertical: wp(1),
  },
  txt: {
    fontSize: wp(6),
    color: 'black',
    fontWeight: 'bold',
  },
  cardContainer: {
    alignItems: 'center',
    marginTop: hp(5),
  },
  optionImage: {
    position: 'absolute',
    height: '85%',
    width: '85%',
    zIndex: 1,
  },
  homeContainer: {
    position: 'absolute',
    right: wp(-5),
    bottom: hp(16),
    height: hp(12),
    width: wp(35),
  },
  home: {
    height: '100%',
    width: '100%',
  },
});
