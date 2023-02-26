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

export type RootStackParamList = {
  TabTwo: undefined;
  Modal: undefined;
  EditFoodScreen: { foodItemId: string };
};

type ComponentProps = NativeStackScreenProps<RootStackParamList>;

const TabOneScreen = ( {navigation, route }: ComponentProps) => {
  const globalContext = useContext(GlobalContext);

  useEffect(() => {
    const fillFoodContext = async () => {
      const foodItems = await FoodItemFirestoreService.getAllFoodItems();
      foodItems.forEach((foodItem) => {
        globalContext.foodContextDispatch({
          type: FoodContextActionTypes.AddFood,
          payload: foodItem,
        });
      });
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