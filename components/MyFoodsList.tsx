import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import FoodItem, { FoodItemType } from './FoodItem';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../screens/TabOneScreen';

type ComponentProps = {
    foodItemList: Array<FoodItemType>;
    navigation:  NativeStackNavigationProp<RootStackParamList>;
}

const MyFoodList = (props: ComponentProps) => {
    const { foodItemList, navigation } = props; 
    const foodItemListDescending = foodItemList.sort((a: FoodItemType, b: FoodItemType) => {
        return b.addedToInventory - a.addedToInventory;
    }).filter((item) => {
        return item.foodItemId !== "mock-item";
    })
    
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
            {foodItemListDescending.map((foodItem, index) => {
                    return (
                        <View key={index}>
                            <FoodItem foodItem={foodItem} navigation={navigation} />
                            <View
                                style={{
                                    borderBottomColor: 'black',
                                    borderBottomWidth: StyleSheet.hairlineWidth,
                                    marginBottom: 10,
                                }}
                            />
                        </View>
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