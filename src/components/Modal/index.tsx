import {View, Text, Modal, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {
  heightPercent as hp,
  widthPrecent as wp,
} from '../../utils/ResponsiveScreen';

type Props = {
  isVisible: boolean;
  onPress: (txt: boolean) => void;
  txt: string;
};
const MyModal: React.FC<Props> = ({isVisible, onPress, txt}) => {
  return (
    <Modal visible={isVisible} transparent>
      <View style={styles.container}>
        <View style={styles.modal}>
          <View style={styles.blackContainer}>
            <Text style={styles.txt}>{txt}</Text>
          </View>
          <TouchableOpacity
            onPress={() => onPress(!isVisible)}
            style={styles.btn}>
            <Text style={styles.btnText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default MyModal;
const styles = StyleSheet.create({
  modal: {
    height: hp(25),
    width: wp(90),
    backgroundColor: '#c6cccc',
    elevation: 5,
  },
  blackContainer: {
    backgroundColor: 'black',
    height: '60%',
    width: '99%',
    alignSelf: 'center',
    marginTop: '1%',
    elevation: 5,
    paddingHorizontal: wp(2),
    alignItems: 'center',
    justifyContent: 'center',
  },
  txt: {
    color: 'white',
    fontSize: wp(5.5),
    textAlign: 'center',
    fontWeight: '500',
  },
  btn: {
    height: '30%',
    width: '50%',
    backgroundColor: 'white',
    alignSelf: 'center',
    marginTop: '2%',
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    fontSize: wp(6),
    color: 'black',
    fontWeight: '400',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
