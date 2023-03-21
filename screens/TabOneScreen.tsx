import { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { View } from '../components/Themed';
import MyFoodsList from '../components/MyFoodsList';
import { GlobalContext } from '../contexts/globalContext';
import { useEffect } from 'react';
import FoodItemFirestoreService from '../services/FoodItemFirestoreService';
import { FoodContextActionTypes } from '../contexts/foodContextReducer';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FoodItemType } from '../components/FoodItem';
import LocalAsyncStorageService from '../services/LocalAsyncStorageService';
import { RootStackParamList } from '../types';
import UserInfoFirestoreService from '../services/UserInfoFirestoreService';
import { UserInfoActionTypes } from '../contexts/userInfoReducers';

type ComponentProps = NativeStackScreenProps<RootStackParamList>;

const TabOneScreen = ({ navigation, route }: ComponentProps) => {
  const globalContext = useContext(GlobalContext);

  const fillFoodContext = async () => {
    const localUserData = await LocalAsyncStorageService.getUserFromDisk();
    if (localUserData) {
      const foodItems = await FoodItemFirestoreService.getAllFoodItems(
        localUserData.userId
      );
      foodItems.forEach((foodItem) => {
        globalContext.foodContextDispatch({
          type: FoodContextActionTypes.AddFood,
          payload: foodItem,
        });
      });

      // get the user info early since we know the user id
      const userInfo = await UserInfoFirestoreService.getUserInfo(
        localUserData.userId
      );
      globalContext.userInfoDispatch({
        type: UserInfoActionTypes.UpdateUserInfo,
        payload: userInfo,
      });
    } else {
      navigation.navigate('ProfilePageScreen');
    }
  };

  //update our food items every time we navigate to this screen
  navigation.addListener('focus', async () => {
    fillFoodContext();
  });

  useEffect(() => {
    fillFoodContext();
  }, []);

  return (
    <View style={styles.container}>
      <MyFoodsList
        itemType={FoodItemType.inventoryItem}
        foodItemList={
          globalContext.foodInventoryState
            ? Object.values(globalContext.foodInventoryState)
            : []
        }
        navigation={navigation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default TabOneScreen;
