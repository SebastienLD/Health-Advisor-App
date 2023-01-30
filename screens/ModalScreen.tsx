import React, { useState, useEffect, useReducer, useContext } from 'react';
import { Text, View, StyleSheet, Button, TextInput } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { FoodContext } from '../contexts/foodsContext';
import { FoodContextActionTypes } from '../contexts/foodContextReducer';

// TODO: PUT IN CONFIG FILE
const base_nutritionix_api = "https://trackapi.nutritionix.com/v2/search/item";
const app_id = 'eed60937';
const app_key = '09e865c9a2fbb04be2f1e1de03eb07a4';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [manualUPC, setManualUPC] = useState('');
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
      foodContext.foodContextDispatch({type: FoodContextActionTypes.AddFood, payload: {
        name: json["foods"][0]["food_name"],
        brand: json["foods"][0]["brand_name"],
        amount: `${json["foods"][0]["serving_qty"]} ${json["foods"][0]["serving_unit"]}`,
        calories: json["foods"][0]["nf_calories"],
        image: require('../assets/images/TrailMix.jpeg'),
      }});
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted'); // TODO: FIX TYPING
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => { // TODO: FIX TYPING
    setScanned(true);
    if (type === 'org.gs1.EAN-13') {
      queryNutritionIx(data);
    }
    alert(`Your food item has been added!`);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={styles.scannerContainer}
      />
      {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
      <TextInput
        style={styles.input}
        onChangeText={setManualUPC}
        value={manualUPC}
        placeholder={"Type UPC Manually"}
      />
      <Button
        title="Fetch"
        onPress={() => {
          queryNutritionIx(manualUPC);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  scannerContainer: {
    width: '80%',
    height: '40%',
    marginTop: 20,
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
