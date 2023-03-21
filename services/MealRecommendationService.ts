import { GlobalContextType } from '../contexts/globalContext';
import { MealRecommendationMatrix } from '../contexts/mealRecReducers';
import { BiologicalSex } from '../models/UserInfo';
import { HealthGoal } from '../models/UserInfo';
import OpenAIAPIService from '../services/OpenAIAPIService';

const MRS = {
  calculateBMR: (globalContext: GlobalContextType) => {
    let BMR = 0;
    const W = globalContext.userInfo.weightInPounds / 2.20462;
    const H = globalContext.userInfo.heightInInches * 2.54;
    const A = 30; // aproximate age to 30 for now
    if (globalContext.userInfo.biologicalSex == BiologicalSex.female) {
      BMR = 10 * W + 6.25 * H - 5 * A - 161;
    } else if (globalContext.userInfo.biologicalSex == BiologicalSex.male) {
      BMR = 10 * W + 6.25 * H - 5 * A + 5;
    }
    return BMR;
  },
  getDailyCalorieGoal: (globalContext: GlobalContextType) => {
    const bmr = MRS.calculateBMR(globalContext);
    let plusMinus = bmr * 0.15; // base case is gain muscle
    if (globalContext.userInfo.healthGoal == HealthGoal.lose_fat) {
      plusMinus = plusMinus * -1;
    } else if (
      globalContext.userInfo.healthGoal == HealthGoal.maintain_weight
    ) {
      plusMinus = 0;
    }
    return bmr + plusMinus;
  },
  calculateCurrCalories: (globalContext: GlobalContextType): number => {
    let calorieCount = 0;
    Object.values(globalContext.dailyFoodState).forEach((foodItem) => {
      if (foodItem.foodItemId != 'mock-item') {
        calorieCount += foodItem.calories;
      }
    });
    return calorieCount;
  },
  generateMealRecommendations: async (
    globalContext: GlobalContextType
  ): Promise<MealRecommendationMatrix> => {
    const calorieGoal = MRS.getDailyCalorieGoal(globalContext);
    const calsPerMeal = calorieGoal / globalContext.userInfo.targetMealsPerDay;
    const currEatenCalories = MRS.calculateCurrCalories(globalContext);
    let caloriesLeft = calorieGoal - currEatenCalories;

    const allMealRecOptions: Array<Array<string>> = [];
    while (caloriesLeft > 0) {
      let mealCals = caloriesLeft;
      if (caloriesLeft > calsPerMeal) {
        mealCals = calsPerMeal;
      }

      const mealOptionPromises: Array<Promise<string>> = [];
      for (let i = 0; i < 3; i++) {
        mealOptionPromises.push(
          OpenAIAPIService.getMealRecipe(
            mealCals,
            globalContext.userInfo.healthGoal
          )
        );
      }
      const mealOptions = await Promise.all(mealOptionPromises);
      caloriesLeft -= mealCals;
      allMealRecOptions.push(mealOptions);
    }
    console.log('The meal rec matrix is: ', allMealRecOptions);
    return allMealRecOptions;
  },
};

export default MRS;
