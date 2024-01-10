import {View, Text, Image, StyleSheet} from 'react-native';
import React from 'react';
import {
  widthPrecent as wp,
  heightPercent as hp,
} from '../../utils/ResponsiveScreen';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {
  NavigationAction,
  NavigationProp,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';
import {StackNavigationParams} from '../navigation';
type prop = {
  onLeftPress: () => void;
  onRightPress: () => void;
  practice: boolean;
};
const Header: React.FC<prop> = ({onLeftPress, onRightPress, practice}) => {
  const navigation =
    useNavigation<NavigationProp<StackNavigationParams, 'home'>>();
  return (
    <View style={styles.headercontainer}>
      <TouchableOpacity onPress={onLeftPress} style={styles.headerItem}>
        <Image
          style={styles.icon}
          source={require('../../asset/images/settings.png')}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={onRightPress} style={styles.headerItem}>
        <Image
          style={[styles.icon, {alignSelf: 'center'}]}
          source={
            practice
              ? require('../../asset/images/redbtn.png')
              : require('../../asset/images/whitebtn.png')
          }
          resizeMode="contain"
        />
      </TouchableOpacity>
      <View style={styles.headerItem}>
        {/* <Image
          style={[styles.icon, {marginRight: wp(2)}]}
          source={require('../../asset/images/settings.png')}
          resizeMode="contain"
        /> */}
      </View>
    </View>
  );
};

export default Header;
const styles = StyleSheet.create({
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
    width: '0%',
  },
  icon: {
    height: '100%',
    width: hp(6),
    alignSelf: 'flex-start',
  },
});
