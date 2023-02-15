import { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { View } from '../components/Themed';
import MyFoodsList from '../components/MyFoodsList';
import {FoodContext} from '../contexts/foodsContext';


export default function TabOneScreen() {

  const foodContext = useContext(FoodContext);

  return (
    <View style={styles.container}>
      <MyFoodsList foodItemList={foodContext.foodItems} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});