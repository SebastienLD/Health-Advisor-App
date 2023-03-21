import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';
import { GlobalContext, initialGlobalState } from './contexts/globalContext';
import { foodContextReducer } from './contexts/foodContextReducer';
import { useReducer } from 'react';
import { userInfoReducer } from './contexts/userInfoReducers';
import "react-native-url-polyfill/auto"
import { mealRecReducer } from './contexts/mealRecReducers';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const [foodState, foodDispatch] = useReducer(foodContextReducer, initialGlobalState);
  const [userState, userDispatch] = useReducer(userInfoReducer, initialGlobalState);
  const [mealState, mealRecDispatch] = useReducer(mealRecReducer, initialGlobalState);

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
          mealRecState: mealState.mealRecState,
          mealRecDispatch: mealRecDispatch,
        }}>
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
        </GlobalContext.Provider>
      </SafeAreaProvider>
    );
  }
}
