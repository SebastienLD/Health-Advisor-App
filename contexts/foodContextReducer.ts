import { FoodItemType } from "../components/FoodItem";
import { FoodContextType } from "./foodsContext";

export enum FoodContextActionTypes {
  AddFood = 'ADD_FOOD',
  DeleteFood = 'DELETE_FOOD',
}

export interface FoodAction {
  type: FoodContextActionTypes;
  payload: FoodItemType;
}

// reducer function
export const foodContextReducer = (state: FoodContextType, action: FoodAction) => {
  const { type, payload } = action;
  console.log("Got into reducer... adding", payload);
  let next = state;
  switch (type) {
    case FoodContextActionTypes.AddFood:
      console.log("Got into the add food case");
      next = {
        ...state,
        foodItems: next.foodItems.concat([payload]),
      };
      break;
    case FoodContextActionTypes.DeleteFood:
      console.log("Got into the remove food case");
      const foodItemsWithoutItem = next.foodItems.filter((val, index, arr) => {
        return val.foodItemId !== payload.foodItemId;
      });
      next = {
        ...state,
        foodItems: foodItemsWithoutItem,
      }
      break;
    default:
      console.log("Incorrect action type was given");
      break;
  }
  console.log("Next is:", next);
  return next;
};