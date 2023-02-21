import { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { View } from '../components/Themed';
import { FoodContext } from '../contexts/foodsContext';
import MyFoodsList from '../components/MyFoodsList';
import { RootStackParamList } from './TabOneScreen';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type ComponentProps = NativeStackScreenProps<RootStackParamList>;

const TabTwoScreen = ({ navigation, route }: ComponentProps) => {
  const foodContext = useContext(FoodContext);
  return (
    <View style={styles.container}>
      <MyFoodsList 
        foodItemList={
          foodContext.dailyFoodState ? 
            Object.values(foodContext.dailyFoodState)
            : []
          }
        navigation={navigation}
      />
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

export default TabTwoScreen;