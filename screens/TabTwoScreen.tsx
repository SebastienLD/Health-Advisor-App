import { useContext, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { View } from '../components/Themed';
import { FoodContext } from '../contexts/foodsContext';
import { FoodContextActionTypes } from '../contexts/foodContextReducer';
import MyFoodsList from '../components/MyFoodsList';
import { RootStackParamList } from './TabOneScreen';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FoodItemType } from '../components/FoodItem';
import FoodItemFirestoreService from '../services/FoodItemFirestoreService';

type ComponentProps = NativeStackScreenProps<RootStackParamList>;

const TabTwoScreen = ({ navigation, route }: ComponentProps) => {
  const foodContext = useContext(FoodContext);

  useEffect(() => {
    const fillFoodContext = async () => {
      const foodItems = await FoodItemFirestoreService.getTodaysDailyFoods();
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