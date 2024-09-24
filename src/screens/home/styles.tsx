import {Dimensions, StyleSheet} from 'react-native';
import {
  heightPercent as hp,
  widthPrecent as wp,
} from '../../utils/ResponsiveScreen';
const { width, height } = Dimensions.get("window");
const aspectRatio = height / width;
const IsIPAD = aspectRatio < 1.6;
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
  upgadeBtn: {
    height: hp(5),
    width: wp(30),
    position: 'absolute',
    bottom:IsIPAD?hp(6): hp(12),
    right: '1%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp(2),overflow:'hidden',
     backgroundColor: 'yellow', 

   
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3, 
    shadowRadius: 4,   


    elevation: 5,  
  },
  
});
