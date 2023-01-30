import { useState, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Pressable } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'black',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
  }
});