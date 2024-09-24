import React, {createContext, useState, useEffect, ReactNode} from 'react';
import * as RNIap from 'react-native-iap';
import {type Product} from 'react-native-iap';
import constants from '../utils/constants';
import {Alert, Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
type IAPContextType = {
  hasPurchased: boolean;
  products: any[];
  requestPurchase: () => Promise<void>;
  checkPurchases: (bool: boolean) => Promise<void>;
  visible: boolean;
  setVisible: (visible: boolean) => void;
};
interface IAPProviderProps {
  children: ReactNode;
}

export const IAPContext = createContext<IAPContextType | undefined>(undefined);

const IAPProvider: React.FC<IAPProviderProps> = ({children}) => {
  const [hasPurchased, setHasPurchased] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  useEffect(() => {
    getISPurchased();
  }, []);
  const getISPurchased = async () => {
    const purchase = await AsyncStorage.getItem('IN_APP_PURCHASE');
    if (purchase === (constants.productSkus as string[])[0]) {
      setHasPurchased(true);
    } else {
      setHasPurchased(false);
    }
  };
  const checkPurchases = async (bool: boolean) => {
    try {
      const purchases = await RNIap.getAvailablePurchases();
      const premium = purchases.some(
        purchase =>
          purchase.productId === (constants.productSkus as string[])[0],
      );

      if (premium) {
        await AsyncStorage.setItem(
          'IN_APP_PURCHASE',
          (constants.productSkus as string[])[0],
        );
        setHasPurchased(true);
        setVisible(false);

        if (bool) {
          Alert.alert(
            'Purchase Restored',
            'Your purchase has been successfully restored.',
            [{text: 'OK'}],
          );
        }
      } else {
        await AsyncStorage.removeItem('IN_APP_PURCHASE');
        setHasPurchased(false);
        if (bool) {
          Alert.alert(
            'No Purchase Found',
            'You do not have any purchases. Would you like to make a purchase?',
            [
              {
                text: 'Cancel',
                onPress: () => {
                  setVisible(false);
                },
                style: 'cancel',
              },
              {text: 'Purchase', onPress: () => requestPurchase()}, // Implement your purchase logic in handlePurchase function
            ],
            {cancelable: false},
          );
        }
      }
    } catch (error) {
      console.error('Error checking purchases: ', error);
    }
  };
  useEffect(() => {
    const initIAP = async () => {
      try {
        await RNIap.initConnection();

        const availableProducts = await RNIap.getProducts({
          skus: constants.productSkus as string[],
        });
        console.log('this is avali', availableProducts);
        setProducts(availableProducts);
      } catch (error) {
        console.warn('Error during IAP initialization', error);
      }
    };

    initIAP();

    return () => {
      RNIap.endConnection();
    };
  }, []);
  useEffect(() => {
    const purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(
      async purchase => {
        const receipt = purchase.transactionReceipt;
        if (receipt) {
          try {
            await RNIap.finishTransaction({purchase, isConsumable: false});
            Alert.alert(
              'Completed',
              'The Transcation has been completed successfully',
            );
            checkPurchases(false);
            setVisible(false);
          } catch (error) {
            console.error(
              'An error occurred while completing transaction',
              error,
            );
          }
        }
      },
    );

    const purchaseErrorSubscription = RNIap.purchaseErrorListener(error => {
      setVisible(false);
      console.log(error);
    });

    return () => {
      purchaseUpdateSubscription.remove();
      purchaseErrorSubscription.remove();
    };
  }, []);

  const requestPurchase = async () => {
    try {
      if (Platform.OS === 'android') {
        const skus = constants.productSkus as string[];
        await RNIap.requestPurchase({skus});
      } else if (Platform.OS === 'ios') {
        const sku = (constants.productSkus as string[])[0];
        await RNIap.requestPurchase({sku});
      }
    } catch (error: any) {
      // Alert.alert('Message', error.message);
      Alert.alert(getErrorMessage(error));
      console.log('this is error', error);
    }
  };
  function getErrorMessage(errorCode: ErrorCode): string {
    switch (errorCode) {
      case ErrorCode.E_UNKNOWN:
        return "An unknown error has occurred. Please try again later.";
      case ErrorCode.E_USER_CANCELLED:
        return "The operation was cancelled by the user.";
      case ErrorCode.E_USER_ERROR:
        return "An error occurred due to user input. Please check your information.";
      case ErrorCode.E_ITEM_UNAVAILABLE:
        return "The item is currently unavailable. Please try again later.";
      case ErrorCode.E_REMOTE_ERROR:
        return "There was an error communicating with the server. Please try again.";
      case ErrorCode.E_NETWORK_ERROR:
        return "A network error occurred. Please check your internet connection.";
      case ErrorCode.E_SERVICE_ERROR:
        return "There was a service error. Please try again later.";
      case ErrorCode.E_RECEIPT_FAILED:
        return "Failed to process the receipt. Please contact support.";
      case ErrorCode.E_RECEIPT_FINISHED_FAILED:
        return "Receipt processing finished with errors. Please try again.";
      case ErrorCode.E_NOT_PREPARED:
        return "The service is not prepared. Please try again later.";
      case ErrorCode.E_NOT_ENDED:
        return "The operation has not ended. Please wait and try again.";
      case ErrorCode.E_ALREADY_OWNED:
        return "You already own this item.";
      case ErrorCode.E_DEVELOPER_ERROR:
        return "A developer error has occurred. Please contact support.";
      case ErrorCode.E_BILLING_RESPONSE_JSON_PARSE_ERROR:
        return "There was an error processing the billing response. Please try again.";
      case ErrorCode.E_DEFERRED_PAYMENT:
        return "Your payment is deferred. Please check your payment method.";
      case ErrorCode.E_INTERRUPTED:
        return "The operation was interrupted. Please try again.";
      case ErrorCode.E_IAP_NOT_AVAILABLE:
        return "In-app purchases are not available at this time.";
      default:
        return "An unexpected error has occurred. Please contact support.";
    }
  }
  return (
    <IAPContext.Provider
      value={{
        hasPurchased,
        products,
        requestPurchase,
        checkPurchases,
        visible,
        setVisible,
      }}>
      {children}
    </IAPContext.Provider>
  );
};

export default IAPProvider;
