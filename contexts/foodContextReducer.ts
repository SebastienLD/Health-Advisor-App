import { FoodItemType } from "../components/FoodItem";
import { FoodContextType } from "./foodsContext";

export enum FoodContextActionTypes {
  AddFood = 'ADD_FOOD',
  DeleteFood = 'DELETE_FOOD',
  EditFood = 'EDIT_FOOD',
  EatFood = 'EAT_FOOD',
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
    case FoodContextActionTypes.EditFood:
      console.log("Got into the add food case");
      next = {
        ...state,
        foodInventoryState: {
          ...next.foodInventoryState,
          [payload.foodItemId]: payload,
        },
      };
      break;
    case FoodContextActionTypes.DeleteFood:
      console.log("Got into the remove food case");
      delete next.foodInventoryState[payload.foodItemId];
      break;
    case FoodContextActionTypes.EatFood:
      console.log("Got into the eat food case");
      delete next.foodInventoryState[payload.foodItemId]
      // next.dailyFoodState[payload.foodItemId] = payload;
      break;
    default:
      console.log("Incorrect action type was given");
      break;
  }
  console.log("Next is:", next);
  return next;
};