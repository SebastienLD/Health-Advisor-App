import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import { GlobalContext, GlobalContextType, initialGlobalState } from './contexts/globalContext';
import { foodContextReducer } from './contexts/foodContextReducer';
import { useReducer, useState } from 'react';
import { userInfoReducer } from './contexts/userInfoReducers';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const [foodState, foodDispatch] = useReducer(foodContextReducer, initialGlobalState);
  const [userState, userDispatch] = useReducer(userInfoReducer, initialGlobalState);

  if (!isLoadingComplete) {
    return null;
  } else {

    return (
      <SafeAreaProvider>
        <GlobalContext.Provider value={{ 
          foodInventoryState: foodState.foodInventoryState,
          dailyFoodState: foodState.dailyFoodState,
          foodContextDispatch: foodDispatch,
          userInfo: userState.userInfo,
          userInfoDispatch: userDispatch,
        }}>
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
        </GlobalContext.Provider>
      </SafeAreaProvider>
    );
  }
}
