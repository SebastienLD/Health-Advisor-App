import { createContext, Dispatch } from 'react';
import { FoodItem } from '../components/FoodItem';
import { FoodAction } from './foodContextReducer';
import { BiologicalSex, UserInfo } from '../models/UserInfo';
import { UserAction } from './userInfoReducers';

const mockfoodInventoryState = {
  'mock-item': {
    foodItemId: 'mock-item',
    name: 'Trail Mix',
    brand: 'Kirkland',
    serving_qty: 3,
    serving_unit: 'ounces',
    num_servings: 1,
    calories: 160,
    protein: 9,
    fat: 1,
    carbs: 2,
    image: require('../assets/images/TrailMix.jpeg'),
    addedToInventory: 0,
  },
};

export const mockUserInfo: UserInfo = {
  userId: 'MOCK_USER_ID',
  userName: '',
  heightInInches: 65,
  biologicalSex: BiologicalSex.male,
  dateOfBirth: new Date(),
};

type FoodInventoryState = {
  [foodItemId: string]: FoodItem;
};

export type GlobalContextType = {
  // food related
  foodInventoryState: FoodInventoryState;
  dailyFoodState: FoodInventoryState;
  foodContextDispatch: Dispatch<FoodAction>;

  // user related
  userInfo: UserInfo;
  userInfoDispatch: Dispatch<UserAction>;
};

export const initialGlobalState = {
  foodInventoryState: mockfoodInventoryState,
  dailyFoodState: mockfoodInventoryState,
  foodContextDispatch: (value: FoodAction) => {
    return;
  },
  userInfo: mockUserInfo,
  userInfoDispatch: (value: UserAction) => {
    return;
  },
};

export const GlobalContext =
  createContext<GlobalContextType>(initialGlobalState);
