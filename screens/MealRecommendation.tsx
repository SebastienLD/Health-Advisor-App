import { useState, useContext, useEffect } from 'react';
import { View } from '../components/Themed';
import { Text, StyleSheet, ScrollView } from 'react-native';
import { GlobalContext } from '../contexts/globalContext';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import MRS, { MealRecObject } from '../services/MealRecommendationService';
import { MealRecActionTypes } from '../contexts/mealRecReducers';
import MealRec from '../components/MealRec';

type ComponentProps = NativeStackScreenProps<RootStackParamList>;

const MealRecommendation = ({ navigation, route }: ComponentProps) => {
  const [mealRecs, setMealRecs] = useState<Array<Array<MealRecObject>>>([]);
  const [loading, setLoading] = useState(false);
  const globalContext = useContext(GlobalContext);

  const handleGetResponse = async () => {
    try {
      globalContext.mealRecDispatch({
        type: MealRecActionTypes.UpdateMealRecMatrix,
        payload: {
          ...globalContext.mealRecState,
          fetchingRecs: true,
        },
      });
      const mealRecs = await MRS.generateMealRecommendations(globalContext);
      globalContext.mealRecDispatch({
        type: MealRecActionTypes.UpdateMealRecMatrix,
        payload: {
          fetchingRecs: false,
          mealRecommendationMatrix: mealRecs,
        },
      });
    } catch (e) {
      console.log('Getting open ai response failed with', e);
    }
  };

  useEffect(() => {
    setLoading(globalContext.mealRecState.fetchingRecs);
    if (globalContext.mealRecState.fetchingRecs) {
      setMealRecs([]);
    } else {
      setMealRecs(globalContext.mealRecState.mealRecommendationMatrix);
    }
  }, [globalContext.mealRecState]);

  useEffect(() => {
    setMealRecs([]);
    handleGetResponse();
  }, [globalContext.dailyFoodState, globalContext.userInfo]);

  const Border = () => {
    return (
      <View
        style={{
          borderBottomColor: 'black',
          borderBottomWidth: StyleSheet.hairlineWidth,
          marginBottom: 10,
        }}
      />
    );
  };

  return (
    <View style={{ height: '100%' }}>
      <View style={{ padding: 15}}>
        <Text>Hi, {globalContext.userInfo.userName}</Text>
        <Text>
          You have{' '}
          {Math.round(MRS.getDailyCalorieGoal(globalContext))}{' '}-{' '}
          {Math.round(MRS.calculateCurrCalories(globalContext))}{' '}={' '}
          {Math.round(
            MRS.getDailyCalorieGoal(globalContext) -
              MRS.calculateCurrCalories(globalContext)
          )}{' '}
          calories left
        </Text>
        <Text>
          Based on this, here are your{' '}
          {Math.ceil(
            (MRS.getDailyCalorieGoal(globalContext) -
              MRS.calculateCurrCalories(globalContext)) /
              (MRS.getDailyCalorieGoal(globalContext) /
                globalContext.userInfo.targetMealsPerDay)
          )}{' '}
          next meals
        </Text>
      </View>
      <Border />
      <ScrollView style={styles.response}>
        {loading && (
          <Text>
            Updating your recommended recipes ... this may take a moment.
          </Text>
        )}
        {mealRecs.map((meal, mealIndex) => {
          return (
            <View key={mealIndex}>
              <MealRec mealIndex={mealIndex} mealRecOptions={meal}/>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
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
