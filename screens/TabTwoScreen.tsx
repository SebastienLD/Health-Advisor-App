import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, TextInput } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

const base_nutritionix_api = "https://trackapi.nutritionix.com/v2/search/item";
const app_id = 'eed60937';
const app_key = '09e865c9a2fbb04be2f1e1de03eb07a4';

type FoodItem = {
  food_name: string;
  brand_name: string;
}

type ResponstType = {
  foods: Array<FoodItem>;
}

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scannedFoodResponse, setScannedFoodResponse] = useState<Array<FoodItem>>([{"food_name": "Test", "brand_name": "test test"}]);
  const [manualUPC, setManualUPC] = useState('');

  const queryNutritionIx = async (upc: string) => {
    const api = base_nutritionix_api + `?upc=${upc}`;
    console.log("API is ", api);
    const requestConfig = {
      'method': 'GET',
      'headers': {
        'Content-type': 'application/json',
        'x-app-id': app_id,
        'x-app-key': app_key,
      }
    };
    console.log(requestConfig);
    const fullRequest = new Request(api, requestConfig);
    console.log(fullRequest);
    try {
      const response = await fetch(fullRequest);
      const json = await response.json();
      console.log(json["foods"][0]["food_name"]);
      setScannedFoodResponse(json["foods"]);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    if (type === 'org.gs1.EAN-13') {
      queryNutritionIx(data);
    }
    console.log(scannedFoodResponse);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
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
      <Text>Result</Text>
      {scannedFoodResponse.map((foodItem, index) => {
        return <Text key={index}>Something: {foodItem["food_name"]} {foodItem["brand_name"]}</Text>
      })}
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
