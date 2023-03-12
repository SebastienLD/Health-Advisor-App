import { useState, useContext, useEffect } from 'react';
import { View } from '../components/Themed';
import { Text, StyleSheet, ScrollView } from 'react-native';
import { GlobalContext } from '../contexts/globalContext';

import OpenAIAPIService from '../services/OpenAIAPIService';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { BiologicalSex, HealthGoal } from '../models/UserInfo';

type ComponentProps = NativeStackScreenProps<RootStackParamList>;

const MealRecommendation = ( {navigation, route}: ComponentProps) => {
    const [mealRecs, setMealRecs] = useState<Array<string>>([]);
    const [loading, setLoading] = useState(false);
    const globalContext = useContext(GlobalContext);

    const calculateBMR = () => {
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
    }

    const getDailyCalorieGoal = () => {
        const bmr = calculateBMR();
        let plusMinus = bmr * 0.15; // base case is gain muscle
        if (globalContext.userInfo.healthGoal == HealthGoal.lose_fat) {
            plusMinus = plusMinus * -1;
        } else if (globalContext.userInfo.healthGoal == HealthGoal.maintain_weight) {
            plusMinus = 0;
        }
        return bmr + plusMinus;
    }

    const calculateCurrCalories = (): number => {
        let calorieCount = 0;
        Object.values(globalContext.dailyFoodState).forEach((foodItem) => {
            if (foodItem.foodItemId != "mock-item") {
                calorieCount += foodItem.calories;
            }
        })
        return calorieCount;
    }

    const generateMealRecommendations = async () => {
        const calorieGoal = getDailyCalorieGoal();
        const calsPerMeal = calorieGoal / globalContext.userInfo.targetMealsPerDay;
        const currEatenCalories = calculateCurrCalories();
        let caloriesLeft = calorieGoal - currEatenCalories;
        let mealRecommendationPromises: Array<Promise<string>> = [];
        while (caloriesLeft > 0) {
            let mealCals = caloriesLeft;
            if (caloriesLeft > calsPerMeal) {
                mealCals = calsPerMeal;
            } 
            const mealRec = OpenAIAPIService.getMealRecipe(mealCals, globalContext.userInfo.healthGoal);
            mealRecommendationPromises.push(mealRec);
            caloriesLeft -= mealCals;
        }
        const meals = await Promise.all(mealRecommendationPromises);
        return meals;
    }

    const handleGetResponse = async () => {
        try {
            setLoading(true);
            const mealRecs = await generateMealRecommendations();
            setLoading(false);
            setMealRecs(mealRecs);
        } catch (e) {
            console.log("Getting open ai response failed with", e);
        }
    }
    
    useEffect(() => {
        setMealRecs([]);
        handleGetResponse();
    }, [globalContext.dailyFoodState, globalContext.userInfo]);

    return (
        <View style={{height: '100%'}}>
            <View style={{padding: 15}}>
                <Text>
                    Hi, {globalContext.userInfo.userName}
                </Text>
                <Text>
                    You have {Math.round(getDailyCalorieGoal())} - {Math.round(calculateCurrCalories())} = {Math.round(getDailyCalorieGoal() - calculateCurrCalories())} calories left
                </Text>
                <Text>
                    Based on this, here are your {Math.ceil((getDailyCalorieGoal() - calculateCurrCalories()) / (getDailyCalorieGoal() / globalContext.userInfo.targetMealsPerDay))} next meals
                </Text>
            </View>
            <View
                style={{
                borderBottomColor: 'black',
                borderBottomWidth: StyleSheet.hairlineWidth,
                marginBottom: 10,
                }}
            />
            <ScrollView style={styles.response}>
                {loading && <Text>Updating your recommended recipes ...</Text>}
                {mealRecs.map((mealRecommendation, index) => {
                    return (
                        <View key={index}>
                            <Text style={{fontSize: 20, fontWeight: '600'}}>{`Meal #${index+1}`}</Text>
                            <Text style={{marginBottom: 10}}>{mealRecommendation}</Text>
                        </View>
                    )
                })}
            </ScrollView>
        </View>
    )
};

const styles = StyleSheet.create({
    collapseTitleStyle: {
        color: 'black',
    },
    collapseStyle: {
        borderWidth: 0,
    },
    row: {
      flexDirection: 'row',
      display: 'flex',
      justifyContent: 'space-between',
      padding: 8,
      marginBottom: 8,
    },
    response: {
        maxHeight: '90%',
        overflow: 'scroll',
        padding: 15,
    },
    rowTitle: {
      marginTop: 8,
    },
    nameInput: {
      width: '40%',
      textAlign: 'center',
      height: 40,
      marginRight: 5,
      marginTop: 5,
      borderWidth: 1,
      padding: 10,
    },
    saveButton: {
      alignItems: 'center',
      width: 100,
      borderWidth: 1,
      borderRadius: 10,
      padding: 5,
      borderColor: 'black',
      backgroundColor: '#FFFFFF',
      marginTop: 10,
      marginBottom: 20,
    },
  });

export default MealRecommendation;