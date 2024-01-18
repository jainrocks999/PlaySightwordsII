import {StyleSheet} from 'react-native';
import {
  heightPercent as hp,
  widthPrecent as wp,
} from '../../utils/ResponsiveScreen';
export default StyleSheet.create({
  container: {
    flex: 1,
  },
  img: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  practiImg: {
    height: hp(7),
    width: wp(45),
    alignSelf: 'center',
  },
  practiceText: {
    alignSelf: 'center',
    fontSize: 22,
    color: '#4a4747',
    fontWeight: '800',
    fontStyle: 'italic',
    marginTop: wp(5),
  },
  prePrimary: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: hp(4),
    marginTop: hp(2),
  },
  prePrimaryBtn: {
    height: hp(7),
    width: wp(38),
    justifyContent: 'space-between',
  },
  practiImg2: {
    height: hp(6),
    width: wp(55),
    alignSelf: 'center',
  },
  listContainer: {
    paddingVertical: wp(3),
    backgroundColor: 'white',
    width: '90%',
    zIndex: 1,
    alignSelf: 'center',
    elevation: 5,
    shadowColor: 'black',
    shadowOffset: {height: 4, width: 4},
    shadowOpacity: 4,
    shadowRadius: 3,
    marginTop: hp(3),
    maxHeight: hp(55),
  },
  list: {
    paddingHorizontal: hp(2),
    marginVertical: wp(2),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listtxt: {
    fontSize: wp(5),
    color: 'black',
  },
  adioBtn: {
    height: hp(3),
    width: hp(3),
  },
  homeContainer: {
    height: hp(12),
    width: hp(12),
    position: 'absolute',
    bottom: hp(3),
    alignSelf: 'center',
  },
  home: {
    height: hp(14),
    width: hp(14),
    alignSelf: 'center',
    position: 'absolute',
    bottom: hp(10),
  },
});
