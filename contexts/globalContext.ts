import { createContext, Dispatch } from 'react';
import { FoodItem } from '../components/FoodItem';
import { FoodAction } from './foodContextReducer';
import {
  BiologicalSex,
  HealthGoal,
  UserDietPreferences,
  UserInfo,
} from '../models/UserInfo';
import { UserAction } from './userInfoReducers';
import { MealRecAction, MealRecommendationMatrix } from './mealRecReducers';

const mockItem: FoodItem = {
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
  userId: 'MOCK_USER_ID',
};

const mockfoodInventoryState = {
  'mock-item': mockItem,
};

export const defaultDietPreferences: UserDietPreferences = {
  isLactoseIntolerant: false,
  isGlutenFree: false,
  isVeg: false,
  isKosher: false,
  isKeto: false,
  hasDiabetes: false,
  isDairyFree: false,
  isLowCarb: false,
};

export const mockUserInfo: UserInfo = {
  userId: 'MOCK_USER_ID',
  userName: '',
  heightInInches: 65,
  biologicalSex: BiologicalSex.male,
  weightInPounds: 150,
  healthGoal: HealthGoal.maintain_weight,
  targetMealsPerDay: 3,
  dietPreferences: defaultDietPreferences,
};

type FoodInventoryState = {
  [foodItemId: string]: FoodItem;
};

export type MealRecState = {
  fetchingRecs: boolean;
  mealRecommendationMatrix: MealRecommendationMatrix;
};

export type GlobalContextType = {
  // food related
  foodInventoryState: FoodInventoryState;
  dailyFoodState: FoodInventoryState;
  foodContextDispatch: Dispatch<FoodAction>;

  // user related
  userInfo: UserInfo;
  userInfoDispatch: Dispatch<UserAction>;

  // meal recommendations
  mealRecState: MealRecState;
  mealRecDispatch: Dispatch<MealRecAction>;
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
  mealRecState: {
    mealRecommendationMatrix: [],
    fetchingRecs: false,
  },
  mealRecDispatch: (value: MealRecAction) => {
    return;
  },
};

export const GlobalContext =
  createContext<GlobalContextType>(initialGlobalState);
