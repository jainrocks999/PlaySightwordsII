import {Platform} from 'react-native';

const productSkus = Platform.select({
  android: ['sightwords_ads_purchase'],
  ios: ['com.eflash.eFlash.proupgrade'],
});
export default {
  productSkus: productSkus,
};
