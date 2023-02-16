import { createContext, Dispatch } from 'react';
import { FoodItemType } from '../components/FoodItem';
import { FoodAction } from './foodContextReducer';

const mockFoodItemState = {
    "123": {
      foodItemId: "123",
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
}

type FoodItemState = {
  [foodItemId: string]: FoodItemType;
}

export type FoodContextType = {
    foodItemState: FoodItemState;
    foodContextDispatch: Dispatch<FoodAction>;
}

export const initialFoodState = {
    foodItemState: mockFoodItemState,
    foodContextDispatch: () => {},
}

export const FoodContext = createContext<FoodContextType>(initialFoodState);