
import { useContext } from 'react';
import { Text, View } from './Themed';
import { StyleSheet, Image, ImageSourcePropType, Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { FoodContext } from '../contexts/foodsContext';
import { FoodContextActionTypes } from '../contexts/foodContextReducer';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../screens/TabOneScreen';

export type FoodItemType = {
    foodItemId: string;
    name: string;
    brand: string;
    serving_qty: number;
    serving_unit: string;
    num_servings: number;
    image: ImageSourcePropType;
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
    addedToInventory: number;
}

type ComponentProps = {
  foodItem: FoodItemType;
  navigation:  NativeStackNavigationProp<RootStackParamList>;
}


const FoodItem = (props: ComponentProps) => {
    const { foodItem, navigation } = props;
    const {name, brand, serving_qty, serving_unit, calories, image, num_servings} = foodItem;
    const foodContext = useContext(FoodContext);

    const onRemoveFood = () => {
      foodContext.foodContextDispatch({
        type: FoodContextActionTypes.DeleteFood,
        payload: props.foodItem,
      });
    };

    return (
      <Pressable 
        style={styles.row}
        onPress={() => navigation.navigate("EditFoodScreen",{ foodItemId: foodItem.foodItemId },
        )}
      >
        <View style={styles.rowContainer}>
          <Image
            style={styles.image}
            source={image}
            resizeMode={"cover"} // <- needs to be "cover" for borderRadius to take effect on Android
            />
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.info}>{brand}, {num_servings * serving_qty} {serving_unit}</Text>
          <Text style={styles.calories}>{calories * num_servings} cals</Text>
        </View>
        <Ionicons
          style={{marginTop: 10, marginRight: 10}}
          onPress={() => onRemoveFood()}
          name="trash-bin-outline" 
          size={32} 
        />
      </Pressable>
    )
};

const styles = StyleSheet.create({
    row: {
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
      rowContainer: {
      flex: 1,
      flexWrap: 'wrap',
      height: 65,
      alignItems: 'flex-start',
      justifyContent: 'center',
      marginBottom: 10,
    },
    name: {
      fontSize: 17,
      fontWeight: 'bold',
    },
    info: {
      fontSize: 14,
    },
    calories: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    image: {
      width: 60,
      height: 60,
      marginRight: 10,
      borderColor: 'black',
      borderWidth: 2,
      borderRadius: 75
    },
  });
  

export default FoodItem;