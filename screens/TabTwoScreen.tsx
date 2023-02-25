import { useContext, useEffect } from 'react';
import { StyleSheet, Button } from 'react-native';
import { View } from '../components/Themed';
import { FoodContext } from '../contexts/foodsContext';
import { FoodContextActionTypes } from '../contexts/foodContextReducer';
import MyFoodsList from '../components/MyFoodsList';
import { RootStackParamList } from './TabOneScreen';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FoodItemType } from '../components/FoodItem';
import FoodItemFirestoreService from '../services/FoodItemFirestoreService';
import DailyFoodItemFirestoreService from '../services/DailyFoodItemFirestoreServices';

type ComponentProps = NativeStackScreenProps<RootStackParamList>;

const TabTwoScreen = ({ navigation, route }: ComponentProps) => {
  const foodContext = useContext(FoodContext);

  
  const mockItem =  {
    foodItemId: "mock-item",
    name: "Trail Mix",
    brand: "Kirkland",
    serving_qty: 3,
    serving_unit: 'ounces',
    num_servings: 1,
    calories: 160,
    protein: 9,
    fat: 1,
    carbs: 2,
    image: require('../assets/images/TrailMix.jpeg'),
    addedToInventory: 0,
  }

  const firebaseTest = (() => {
    FoodItemFirestoreService.uploadFoodItem(mockItem)
  })

  useEffect(() => {
    const fillFoodContext = async () => {
      const foodItems = await DailyFoodItemFirestoreService.getTodaysDailyFoods();
      foodItems.forEach((foodItem) => {
        foodContext.foodContextDispatch({
          type: FoodContextActionTypes.AddDailyFood,
          payload: foodItem,
        });
      });
    }
    fillFoodContext();
  }, []);

  return (
  
    <View style={styles.container}>
      <Button
        onPress={firebaseTest}
        title="Learn More"
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      />
      <MyFoodsList
        itemType={FoodItemType.dailyFoodItem}
        foodItemList={
          foodContext.dailyFoodState ? 
            Object.values(foodContext.dailyFoodState)
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

export default TabTwoScreen;