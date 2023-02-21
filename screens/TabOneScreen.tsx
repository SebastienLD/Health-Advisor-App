import { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { View } from '../components/Themed';
import MyFoodsList from '../components/MyFoodsList';
import {FoodContext} from '../contexts/foodsContext';
import { useEffect } from 'react';
import FoodItemFirestoreService from '../services/FoodItemFirestoreService';
import { FoodContextActionTypes } from '../contexts/foodContextReducer';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  TabTwo: undefined;
  Modal: undefined;
  EditFoodScreen: { foodItemId: string };
};

type ComponentProps = NativeStackScreenProps<RootStackParamList>;

const TabOneScreen = ( {navigation, route }: ComponentProps) => {
  const foodContext = useContext(FoodContext);
  console.log(foodContext);

  useEffect(() => {
    const fillFoodContext = async () => {
      const foodItems = await FoodItemFirestoreService.getAllFoodItems();
      foodItems.forEach((foodItem) => {
        foodContext.foodContextDispatch({
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
        foodItemList={
          foodContext.foodInventoryState ? 
            Object.values(foodContext.foodInventoryState)
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