
import { Text, View } from './Themed';
import { StyleSheet, Image, ImageSourcePropType } from 'react-native';

export type FoodItemType = {
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
}

type ComponentProps = {
  foodItem: FoodItemType;
}

const FoodItem = (props: ComponentProps) => {
    const {name, brand, serving_qty, serving_unit, calories, image } = props.foodItem;
    return (
      <View style={styles.rowContainer}>
        <Image
          style={styles.image}
          source={image}
          resizeMode={"cover"} // <- needs to be "cover" for borderRadius to take effect on Android
        />
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.info}>{brand}, {serving_qty} {serving_unit}</Text>
        <Text style={styles.calories}>{calories} cals</Text>
      </View>
    )
};

const styles = StyleSheet.create({
    rowContainer: {
      flex: 1,
      flexWrap: 'wrap',
      height: 80,
      alignItems: 'flex-start',
      justifyContent: 'center',
      marginBottom: 10,
    },
    name: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    info: {
      fontSize: 16,
    },
    calories: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    image: {
      width: 80,
      height: 80,
      marginRight: 10,
      borderColor: 'black',
      borderWidth: 2,
      borderRadius: 75
    },
  });
  

export default FoodItem;