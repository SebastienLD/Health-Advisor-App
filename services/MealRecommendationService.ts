import { GlobalContext, GlobalContextType } from '../contexts/globalContext';
import { MealRecommendationMatrix } from '../contexts/mealRecReducers';
import { BiologicalSex } from '../models/UserInfo';
import { HealthGoal } from '../models/UserInfo';
import OpenAIAPIService from '../services/OpenAIAPIService';

export interface MealRecObject {
  recipeName: string;
  calories: string;
  protein: string;
  carbs: string;
  fats: string;

  isLactoseIntolerant: string;
  isGlutenFree: string;
  isVeg: string;
  isKosher: string;
  isKeto: string;
  hasDiabetes: string;
  isDairyFree: string;
  isLowCarb: string;

  recipeIngredients: string;
  recipeInstructions: string;
}

const RESP_FIELD_CONVERTER: Array<Array<string>> = [
  ['Recipe Name', 'recipeName'],
  ['Calories', 'calories'],
  ['Protein', 'protein'],
  ['Carbohydrates', 'carbs'],
  ['Fats', 'fats'],
  ['Lactose Free', 'isLactoseIntolerant'],
  ['Gluten Free', 'isGlutenFree'],
  ['Dairy Free', 'isDairyFree'],
  ['Vegetarian', 'isVeg'],
  ['Kosher', 'isKosher'],
  ['Keto', 'isKeto'],
  ['Good for diabetes', 'hasDiabetes'],
  ['Low carbohydrates', 'isLowCarb'],
  ['Recipe Ingredients', 'recipeIngredients'],
  ['Recipe Instructions', 'recipeInstructions'],
];

let mealRecObject = { test: 'blah', test2: 'blah' };

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
  scoreMealRecommendation: (
    globalContext: GlobalContextType,
    mealRec: MealRecObject
  ): number => {
    const dietPreferences = MRS.getUserDietPreferences(globalContext);
    let score = 0;
    if (dietPreferences.isLactoseIntolerant) {
      if (mealRec.isLactoseIntolerant == 'Yes') {
        score += 1;
      }
    }
    if (dietPreferences.isGlutenFree) {
      if (mealRec.isGlutenFree == 'Yes') {
        score += 1;
      }
    }
    if (dietPreferences.isVeg) {
      if (mealRec.isVeg == 'Yes') {
        score += 1;
      }
    }
    if (dietPreferences.isKosher) {
      if (mealRec.isKosher == 'Yes') {
        score += 1;
      }
    }
    if (dietPreferences.isKeto) {
      if (mealRec.isKeto == 'Yes') {
        score += 1;
      }
    }
    if (dietPreferences.hasDiabetes) {
      if (mealRec.hasDiabetes == 'Yes') {
        score += 1;
      }
    }
    if (dietPreferences.isDairyFree) {
      if (mealRec.isDairyFree == 'Yes') {
        score += 1;
      }
    }
    if (dietPreferences.isLowCarb) {
      if (mealRec.isLowCarb == 'Yes') {
        score += 1;
      }
    }
    return score;
  },

  generateMealRecommendations: async (
    globalContext: GlobalContextType
  ): Promise<MealRecommendationMatrix> => {
    console.log(
      '--------------------- GENERATING MEAL RECS ---------------------'
    );
    const calorieGoal = MRS.getDailyCalorieGoal(globalContext);
    const calsPerMeal = calorieGoal / globalContext.userInfo.targetMealsPerDay;
    const currEatenCalories = MRS.calculateCurrCalories(globalContext);
    let caloriesLeft = calorieGoal - currEatenCalories;

    const allMealRecOptions: Array<Array<MealRecObject>> = [];
    while (caloriesLeft > 0) {
      let mealCals = caloriesLeft;
      if (caloriesLeft > calsPerMeal) {
        mealCals = calsPerMeal;
      }

      const parsedMealOptionPromises: Array<Promise<MealRecObject>> = [];
      for (let i = 0; i < 5; i++) {
        parsedMealOptionPromises.push(
          MRS.getParsedMealRecObject(
            mealCals,
            globalContext.userInfo.healthGoal
          )
        );
      }
      const parsedMealOptions = await Promise.all(parsedMealOptionPromises);
      caloriesLeft -= mealCals;
      allMealRecOptions.push(parsedMealOptions);
    }

    allMealRecOptions.forEach((mealOptions) => {
      mealOptions.sort((a, b) => {
        const aScore = MRS.scoreMealRecommendation(globalContext, a);
        const bScore = MRS.scoreMealRecommendation(globalContext, b);
        return bScore - aScore;
      });
    });

    console.log(allMealRecOptions);
    return allMealRecOptions;
  },
  getParsedMealRecObject: async (
    calories: number,
    healthGoal: HealthGoal
  ): Promise<MealRecObject> => {
    const mealRec = await OpenAIAPIService.getMealRecipe(calories, healthGoal);
    let parsedMealRecObject = {};
    RESP_FIELD_CONVERTER.forEach(([msg_key, obj_key]) => {
      const fieldVal = getFieldResponse(msg_key, mealRec);
      parsedMealRecObject = {
        ...parsedMealRecObject,
        [obj_key]: fieldVal,
      };
    });
    return parsedMealRecObject as MealRecObject;
  },
};

export default MRS;
