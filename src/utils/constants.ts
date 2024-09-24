import {Platform} from 'react-native';

const productSkus = Platform.select({
  android: ['sightwords_ads_purchase'],
  ios: ['com.eflashapps.sightwords2.proupgrade'],
});
export default {
  productSkus: productSkus,
};
