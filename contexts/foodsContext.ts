import { createContext, Dispatch } from 'react';
import { FoodItem } from '../components/FoodItem';
import { FoodAction } from './foodContextReducer';

const mockfoodInventoryState = {
    "mock-item": {
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
}

type foodInventoryState = {
  [foodItemId: string]: FoodItem;
}

export type FoodContextType = {
    foodInventoryState: foodInventoryState;
    dailyFoodState: foodInventoryState;
    foodContextDispatch: Dispatch<FoodAction>;
}

export const initialFoodState = {
    foodInventoryState: mockfoodInventoryState,
    dailyFoodState: mockfoodInventoryState,
    foodContextDispatch: (value: FoodAction) => {
      console.log(value.payload);
      return;
    },
}

export const FoodContext = createContext<FoodContextType>(initialFoodState);