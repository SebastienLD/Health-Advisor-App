import { Text, StyleSheet } from 'react-native';
import { MealRecObject } from '../services/MealRecommendationService';
import { View } from './Themed';
import Checkbox from 'expo-checkbox';
import { useState } from 'react';

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

interface ComponentProps {
    mealIndex: number;
    mealRecOptions: MealRecObject[];
}

const MealRec = (props: ComponentProps) => {
    const { mealIndex, mealRecOptions } = props;
    const mealRecOne = mealRecOptions[0];
    const mealRecTwo = mealRecOptions[1];
    const mealRecThree = mealRecOptions[2];
    const [oneNutr, setOneNutr] = useState(false);
    const [twoNutr, setTwoNutr] = useState(false);
    const [threeNutr, setThreeNutr] = useState(false);

    const [oneRecipe, setoneRecipe] = useState(false);
    const [twoRecipe, setTwoRecipe] = useState(false);
    const [threeRecipe, setThreeRecipe] = useState(false);

    const [oneIngred, setoneIngred] = useState(false);
    const [twoIngred, setTwoIngred] = useState(false);
    const [threeIngred, setThreeIngred] = useState(false);

    return (
        <>
            {/* Option 1 */}
            <Text style={{ fontSize: 20, fontWeight: '600' }}>{`Meal #${
                mealIndex + 1
            }`}</Text>
            <Border />
            <Text
                style={styles.optionName}
            >Option #1: {mealRecOne.recipeName}</Text>
            <View>
                <View style={styles.checkBoxItem}>
                    <Text>Show Nutrition</Text>
                    <Checkbox value={oneNutr} onValueChange={setOneNutr}/>
                </View>
                {oneNutr && <View style={styles.optionBox}>
                    <Text>Calories: {mealRecOne.calories}</Text>
                    <Text>Protein: {mealRecOne.protein}</Text>
                    <Text>Carbs: {mealRecOne.carbs}</Text>
                    <Text>Fats: {mealRecOne.fats}</Text>
                </View>}
            </View>
            
            <View>
                <View style={styles.checkBoxItem}>
                    <Text>Show Ingredients</Text>
                    <Checkbox value={oneIngred} onValueChange={setoneIngred}/>
                </View>
                {oneIngred && <View style={styles.optionBox}>
                    <Text>{mealRecOne.recipeIngredients}</Text>
                </View>}
            </View>
            <View>
                <View style={styles.checkBoxItem}>
                    <Text>Show Recipe Instructios</Text>
                    <Checkbox value={oneRecipe} onValueChange={setoneRecipe}/>
                </View>
                {oneRecipe && <View style={styles.optionBox}>
                    <Text>{mealRecOne.recipeInstructions}</Text>
                </View>}
            </View>

            <Text
                style={styles.optionName}
            >Option #2: {mealRecTwo.recipeName}</Text>
            <View>
                <View style={styles.checkBoxItem}>
                    <Text>Show Nutrition</Text>
                    <Checkbox value={twoNutr} onValueChange={setTwoNutr}/>
                </View>
                {twoNutr && <View style={styles.optionBox}>
                    <Text>Calories: {mealRecTwo.calories}</Text>
                    <Text>Protein: {mealRecTwo.protein}</Text>
                    <Text>Carbs: {mealRecTwo.carbs}</Text>
                    <Text>Fats: {mealRecTwo.fats}</Text>
                </View>}
            </View>
            
            <View>
                <View style={styles.checkBoxItem}>
                    <Text>Show Ingredients</Text>
                    <Checkbox value={twoIngred} onValueChange={setTwoIngred}/>
                </View>
                {twoIngred && <View style={styles.optionBox}>
                    <Text>{mealRecTwo.recipeIngredients}</Text>
                </View>}
            </View>
            <View>
                <View style={styles.checkBoxItem}>
                    <Text>Show Recipe Instructios</Text>
                    <Checkbox value={twoRecipe} onValueChange={setTwoRecipe}/>
                </View>
                {twoRecipe && <View style={styles.optionBox}>
                    <Text>{mealRecTwo.recipeInstructions}</Text>
                </View>}
            </View>

            <Text
                style={styles.optionName}
            >Option #3: {mealRecThree.recipeName}</Text>
            <View>
                <View style={styles.checkBoxItem}>
                    <Text>Show Nutrition</Text>
                    <Checkbox value={threeNutr} onValueChange={setThreeNutr}/>
                </View>
                {threeNutr && <View style={styles.optionBox}>
                    <Text>Calories: {mealRecThree.calories}</Text>
                    <Text>Protein: {mealRecThree.protein}</Text>
                    <Text>Carbs: {mealRecThree.carbs}</Text>
                    <Text>Fats: {mealRecThree.fats}</Text>
                </View>}
            </View>
            
            <View>
                <View style={styles.checkBoxItem}>
                    <Text>Show Ingredients</Text>
                    <Checkbox value={threeIngred} onValueChange={setThreeIngred}/>
                </View>
                {threeIngred && <View style={styles.optionBox}>
                    <Text>{mealRecThree.recipeIngredients}</Text>
                </View>}
            </View>
            <View>
                <View style={styles.checkBoxItem}>
                    <Text>Show Recipe Instructios</Text>
                    <Checkbox value={threeRecipe} onValueChange={setThreeRecipe}/>
                </View>
                {threeRecipe && <View style={styles.optionBox}>
                    <Text>{mealRecThree.recipeInstructions}</Text>
                </View>}
            </View>
        </>
    )
};

const styles = StyleSheet.create({
    checkBoxItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        marginTop: 10,
    },
    optionName: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 10,
    },
    row: {
      flexDirection: 'row',
      display: 'flex',
      justifyContent: 'space-between',
      padding: 8,
      marginBottom: 8,
    },
    optionBox: {
        backgroundColor: '#e8e8e8',
    },
});
 
export default MealRec;