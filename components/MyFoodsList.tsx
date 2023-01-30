import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import FoodItem, { FoodItemType } from './FoodItem';

type ComponentProps = {
    foodItemList: Array<FoodItemType>;
}

const MyFoodList = (props: ComponentProps) => {
    const { foodItemList } = props; 
    
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
            {foodItemList.map((foodItem, index) => {
                    return (
                        <FoodItem key={index} foodItem={foodItem} />
                    )
                })
            }
            </ScrollView>
        </SafeAreaView>
    )
};

const styles = StyleSheet.create({
    container: {
        height: '95%',
        width: '95%',
    },
  });

export default MyFoodList;