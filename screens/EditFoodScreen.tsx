import { useContext, useEffect, useState } from 'react';
import { FoodContext } from '../contexts/foodsContext';
import { View, StyleSheet } from 'react-native';
import ConfirmFood from '../components/ConfirmFood';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FoodItemType } from '../components/FoodItem';
import { FoodContextActionTypes } from '../contexts/foodContextReducer';
import FoodItemFirestoreService from '../services/FoodItemFirestoreService';

type ParamList = {
    TabOne: undefined;
    EditFoodScreen: { foodItemId: string };
}

type ComponentProps = NativeStackScreenProps<ParamList, "EditFoodScreen">;

const EditFoodScreen = ( {navigation, route } : ComponentProps ) => {

    const foodContext = useContext(FoodContext);
    const [foodItem, setFoodItem] = useState<FoodItemType>();

    const handleConfirmFood = (confirmedFoodItem: FoodItemType) => {
        console.log("Clicked confirm button");
        foodContext.foodContextDispatch({
          type: FoodContextActionTypes.EditFood,
          payload: confirmedFoodItem
        });
        FoodItemFirestoreService.editFoodItem(confirmedFoodItem);
        navigation.navigate('TabOne');
      }

    useEffect(() => {
        setFoodItem(foodContext.foodItemState[route.params.foodItemId]);
    }, []);

    return (
        <View style={styles.container}>
            { foodItem && 
            <ConfirmFood 
                receivedResponse={true}
                foodItem={foodItem}
                handleConfirmFood={handleConfirmFood}
                scanned={true}
            />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
    },
  });

export default EditFoodScreen;