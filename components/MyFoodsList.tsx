import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import FoodItemRow, { FoodItem, FoodItemType } from './FoodItem';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../screens/TabOneScreen';

type ComponentProps = {
    foodItemList: Array<FoodItem>;
    itemType: FoodItemType;
    navigation:  NativeStackNavigationProp<RootStackParamList>;
}

const MyFoodList = (props: ComponentProps) => {
    const { foodItemList, itemType, navigation } = props; 
    const foodItemListDescending = foodItemList.sort((a: FoodItem, b: FoodItem) => {
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
                            <FoodItemRow foodItem={foodItem} itemType={itemType} navigation={navigation} />
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