import { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { View } from '../components/Themed';
import MyFoodsList from '../components/MyFoodsList';
import {FoodContext} from '../contexts/foodsContext';
import { useEffect } from 'react';
import FoodItemFirestoreService from '../services/FoodItemFirestoreService';
import { FoodContextActionTypes } from '../contexts/foodContextReducer';


export default function TabOneScreen() {

  const foodContext = useContext(FoodContext);

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
      <MyFoodsList foodItemList={foodContext.foodItems} />
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