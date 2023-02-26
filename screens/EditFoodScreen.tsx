import { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../contexts/globalContext';
import { View, StyleSheet } from 'react-native';
import ConfirmFood from '../components/ConfirmFood';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FoodItem } from '../components/FoodItem';
import { FoodContextActionTypes } from '../contexts/foodContextReducer';
import FoodItemFirestoreService from '../services/FoodItemFirestoreService';

type ParamList = {
    TabOne: undefined;
    EditFoodScreen: { foodItemId: string };
}

type ComponentProps = NativeStackScreenProps<ParamList, "EditFoodScreen">;

const EditFoodScreen = ( {navigation, route } : ComponentProps ) => {

    const globalContext = useContext(GlobalContext);
    const [foodItem, setFoodItem] = useState<FoodItem>();

    const handleConfirmFood = (confirmedFoodItem: FoodItem) => {
        console.log("Clicked confirm button");
        globalContext.foodContextDispatch({
          type: FoodContextActionTypes.EditFood,
          payload: confirmedFoodItem
        });
        FoodItemFirestoreService.editFoodItem(confirmedFoodItem);
        navigation.navigate('TabOne');
      }

    useEffect(() => {
        setFoodItem(globalContext.foodInventoryState[route.params.foodItemId]);
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