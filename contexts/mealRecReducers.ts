import { GlobalContextType, MealRecState } from './globalContext';

export type MealRecommendationMatrix = Array<Array<string>>;

export enum MealRecActionTypes {
  UpdateMealRecMatrix = 'UPDATE_MEAL_REC_MX',
}

export interface MealRecAction {
  type: MealRecActionTypes;
  payload: MealRecState;
}

export const mealRecReducer = (
  state: GlobalContextType,
  action: MealRecAction
) => {
  const { type, payload } = action;
  let next = state;
  switch (type) {
    case MealRecActionTypes.UpdateMealRecMatrix:
      next = {
        ...state,
        mealRecState: payload,
      };
      break;
  }
  return next;
};
