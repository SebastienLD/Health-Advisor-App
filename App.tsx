import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import { FoodContext, FoodContextType, initialFoodState } from './contexts/foodsContext';
import { foodContextReducer } from './contexts/foodContextReducer';
import { useReducer, useState } from 'react';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const [state, dispatch] = useReducer(foodContextReducer, initialFoodState);

  if (!isLoadingComplete) {
    return null;
  } else {

    return (
      <SafeAreaProvider>
        <FoodContext.Provider value={{ foodItems: state.foodItems, foodContextDispatch: dispatch }}>
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
        </FoodContext.Provider>
      </SafeAreaProvider>
    );
  }
}
