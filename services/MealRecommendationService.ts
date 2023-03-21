import { GlobalContext, GlobalContextType } from '../contexts/globalContext';
import { MealRecommendationMatrix } from '../contexts/mealRecReducers';
import { BiologicalSex } from '../models/UserInfo';
import { HealthGoal } from '../models/UserInfo';
import OpenAIAPIService from '../services/OpenAIAPIService';

const getFieldResponse = (field: string, response: string): string => {
  const fieldIndex = response.indexOf(field);
  const endIndex = response.indexOf(',', fieldIndex);
  const startIndex = response.indexOf(':', fieldIndex);
  return response.substring(startIndex + 1, endIndex).trim();
};

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
  getUserDietPreferences: (globalContext: GlobalContextType) => {
    const dietPreferences = globalContext.userInfo.dietPreferences;
    return dietPreferences;
  },
  scoreMealRecommendation: (globalContext: GlobalContextType, mealRec: string): number => {
    const dietPreferences = MRS.getUserDietPreferences(globalContext);
    let score = 0;
    if (dietPreferences.isLactoseIntolerant) {
      const lactoseFree = getFieldResponse('Lactose Free', mealRec);
      if (lactoseFree == 'Yes') {
        score += 1;
      }
    }
    if (dietPreferences.isGlutenFree) {
      const glutenFree = getFieldResponse('Gluten Free', mealRec);
      if (glutenFree == 'Yes') {
        score += 1;
      }
    }
    if (dietPreferences.isVeg) {
      const vegetarian = getFieldResponse('Vegetarian', mealRec);
      if (vegetarian == 'Yes') {
        score += 1;
      }
    }
    if (dietPreferences.isKosher) {
      const kosher = getFieldResponse('Kosher', mealRec);
      if (kosher == 'Yes') {
        score += 1;
      }
    }
    if (dietPreferences.isKeto) {
      const keto = getFieldResponse('Keto', mealRec);
      if (keto == 'Yes') {
        score += 1;
      }
    }
    if (dietPreferences.hasDiabetes) {
      const diabetic = getFieldResponse('Good for diabetes', mealRec);
      if (diabetic == 'Yes') {
        score += 1;
      }
    }
    if (dietPreferences.isDairyFree) {
      const dairyFree = getFieldResponse('Dairy Free', mealRec);
      if (dairyFree == 'Yes') {
        score += 1;
      }
    }
    if (dietPreferences.isLowCarb) {
      const lowCarb = getFieldResponse('Low Carb', mealRec);
      if (lowCarb == 'Yes') {
        score += 1;
      }
    }
    return score;
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
      for (let i = 0; i < 5; i++) {
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

    allMealRecOptions.forEach((mealOptions) => {
      mealOptions.sort((a, b) => {
        const aScore = MRS.scoreMealRecommendation(globalContext, a);
        const bScore = MRS.scoreMealRecommendation(globalContext, b);
        return bScore - aScore;
      });
    });

    console.log(allMealRecOptions)
    return allMealRecOptions;
  },
};

export default MRS;
