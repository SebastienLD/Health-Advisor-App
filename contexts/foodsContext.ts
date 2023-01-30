import { createContext, Dispatch } from 'react';
import { FoodItemType } from '../components/FoodItem';
import { AddFoodAction } from './foodContextReducer';

const mockFoodList = [
    {
      name: "Trail Mix",
      brand: "Kirkland",
      amount: "3 tablespoons",
      calories: 160,
      image: require('../assets/images/TrailMix.jpeg'),
    }
  ]

export type FoodContextType = {
    foodItems: Array<FoodItemType>;
    foodContextDispatch: Dispatch<AddFoodAction>;
}

export const initialFoodState = {
    foodItems: mockFoodList,
    foodContextDispatch: () => {}
}

export const FoodContext = createContext<FoodContextType>(initialFoodState);