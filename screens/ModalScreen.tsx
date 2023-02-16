import React, { useState, useEffect, useReducer, useContext } from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import { BarCodeScanner, BarCodeScannedCallback, BarCodeEventCallbackArguments, BarCodeEvent } from 'expo-barcode-scanner';
import { FoodContext } from '../contexts/foodsContext';
import { FoodContextActionTypes } from '../contexts/foodContextReducer';
import ConfirmFood  from '../components/ConfirmFood';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { FoodItemType } from '../components/FoodItem';
import FoodItemFirestoreService from '../services/FoodItemFirestoreService';
import uuid from 'react-native-uuid';

export type FullFoodResponse = {
  food_name: string;
  brand_name: string,
  serving_qty: number,
  serving_unit: string,
  serving_weight_grams: number,
  nf_calories: number,
  nf_total_fat: number,
  nf_saturated_fat: number,
  nf_cholesterol: number,
  nf_sodium: number,
  nf_total_carbohydrate: number,
  nf_dietary_fiber: number,
  nf_sugars: number,
  nf_protein: number,
  nf_potassium: number | null,
  nf_p: number | null,
  nix_brand_name: string,
  nix_brand_id: string,
  nix_item_name: string,
  nix_item_id: string,
  photo: {
    thumb: string,
    highres: null,
    is_user_uploaded: boolean
  },
  nf_ingredient_statement: string
}

// TODO: PUT IN CONFIG FILE
const base_nutritionix_api = "https://trackapi.nutritionix.com/v2/search/item";
const app_id = 'eed60937';
const app_key = '09e865c9a2fbb04be2f1e1de03eb07a4';


type RootStackParamList = {
  TabOne: undefined;
  TabTwo: undefined;
};

type ComponentProps = NativeStackScreenProps<RootStackParamList>;


const ModalScreen = ( { navigation, route } : ComponentProps) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [fullFoodResponse, setFullFoodResponse] = useState<FullFoodResponse>();
  const [receivedFoodResponse, setReceievedFoodResponse] = useState(false);
  const foodContext = useContext(FoodContext);

  const queryNutritionIx = async (upc: string) => {
    const api = base_nutritionix_api + `?upc=${upc}`;
    const requestConfig = {
      'method': 'GET',
      'headers': {
        'Content-type': 'application/json',
        'x-app-id': app_id,
        'x-app-key': app_key,
      }
    };
    const fullRequest = new Request(api, requestConfig);
    try {
      const response = await fetch(fullRequest);
      const json = await response.json();
      if (response.ok) {
        setReceievedFoodResponse(true);
      }
      setFullFoodResponse(json["foods"][0]);
    } catch (error) {
      console.log(error);
    }
  }

  const handleConfirmFood = (confirmedFoodItem: FoodItemType) => {
    console.log("Clicked confirm button");
    foodContext.foodContextDispatch({
      type: FoodContextActionTypes.AddFood,
      payload: confirmedFoodItem
    });
    FoodItemFirestoreService.uploadFoodItem(confirmedFoodItem);
    navigation.navigate('TabOne');
  }

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned: BarCodeScannedCallback = (params: BarCodeEvent) => {
    setScanned(true);
    if (params.type === 'org.gs1.EAN-13') {
      queryNutritionIx(params.data);
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {!scanned && 
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={styles.scannerContainer}
      />}
      <ConfirmFood 
        receivedResponse={receivedFoodResponse}
        foodItem={fullFoodResponse ? {
          // setting temporary uuid, will get overridden by firebase
          foodItemId: String(uuid.v4()),
          name: fullFoodResponse.food_name,
          brand: fullFoodResponse.brand_name,
          serving_qty: fullFoodResponse.serving_qty,
          serving_unit: fullFoodResponse.serving_unit,
          num_servings: 1,
          calories: fullFoodResponse.nf_calories,
          image: {uri: fullFoodResponse.photo.thumb},
          protein: fullFoodResponse.nf_protein,
          fat: fullFoodResponse.nf_total_fat,
          carbs: fullFoodResponse.nf_total_carbohydrate,
          addedToInventory: Date.now(),
        } : undefined}
        handleConfirmFood={handleConfirmFood}
        scanned={scanned}
      />
      {scanned && 
        <Pressable style={styles.pressAgainButton} onPress={() => setScanned(false)} >
          <Text style={{fontSize: 20}}>Scan Again</Text>
        </Pressable>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  pressAgainButton: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 5,
    borderColor: 'black',
    backgroundColor: '#FFFFFF',
    marginTop: 10,
  },
  scannerContainer: {
    width: '90%',
    height: '30%',
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 15,
    overflow: 'hidden',
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
  input: {
    width: '70%',
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default ModalScreen;