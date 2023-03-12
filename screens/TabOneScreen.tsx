import { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { View } from '../components/Themed';
import MyFoodsList from '../components/MyFoodsList';
import {GlobalContext} from '../contexts/globalContext';
import { useEffect } from 'react';
import FoodItemFirestoreService from '../services/FoodItemFirestoreService';
import { FoodContextActionTypes } from '../contexts/foodContextReducer';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FoodItemType } from '../components/FoodItem';
import LocalAsyncStorageService from '../services/LocalAsyncStorageService';
import { RootStackParamList } from '../types';

type ComponentProps = NativeStackScreenProps<RootStackParamList>;

const TabOneScreen = ( {navigation, route }: ComponentProps) => {
  const globalContext = useContext(GlobalContext);

  useEffect(() => {
    const fillFoodContext = async () => {
      const localUserData = await LocalAsyncStorageService.getUserFromDisk();
      if (localUserData) {
        const foodItems = await FoodItemFirestoreService.getAllFoodItems(localUserData.userId);
        foodItems.forEach((foodItem) => {
          globalContext.foodContextDispatch({
            type: FoodContextActionTypes.AddFood,
            payload: foodItem,
          });
        });
      } else {
        navigation.navigate("ProfilePageScreen");
      }
    }
    fillFoodContext();
  }, []);

  return (
    <View style={styles.container}>
      <MyFoodsList 
        itemType={FoodItemType.inventoryItem}
        foodItemList={
          globalContext.foodInventoryState ? 
            Object.values(globalContext.foodInventoryState)
            : []
          }
        navigation={navigation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default TabOneScreen;