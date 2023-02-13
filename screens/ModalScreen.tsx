import React, { useState, useEffect, useReducer, useContext } from 'react';
import { Text, View, StyleSheet, Button, TextInput } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { FoodContext } from '../contexts/foodsContext';
import { FoodContextActionTypes } from '../contexts/foodContextReducer';
import ConfirmFood from '../components/ConfirmFood';
import { FullFoodResponse } from '../components/ConfirmFood';

const exampleResponse = {
	"foods": [
		{
			"food_name": "Beef Jerky, Chipotle Adobo",
			"brand_name": "Three Jerks",
			"serving_qty": 1,
			"serving_unit": "oz",
			"serving_weight_grams": 28,
			"nf_calories": 100,
			"nf_total_fat": 3,
			"nf_saturated_fat": 1,
			"nf_cholesterol": 30,
			"nf_sodium": 350,
			"nf_total_carbohydrate": 8,
			"nf_dietary_fiber": 1,
			"nf_sugars": 6,
			"nf_protein": 10,
			"nf_potassium": null,
			"nf_p": null,
			"full_nutrients": [
				{
					"attr_id": 203,
					"value": 10
				},
				{
					"attr_id": 204,
					"value": 3
				},
				{
					"attr_id": 205,
					"value": 8
				},
				{
					"attr_id": 208,
					"value": 100
				},
				{
					"attr_id": 269,
					"value": 6
				},
				{
					"attr_id": 291,
					"value": 1
				},
				{
					"attr_id": 301,
					"value": 26
				},
				{
					"attr_id": 303,
					"value": 1.44
				},
				{
					"attr_id": 307,
					"value": 350
				},
				{
					"attr_id": 318,
					"value": 300
				},
				{
					"attr_id": 401,
					"value": 0
				},
				{
					"attr_id": 601,
					"value": 30
				},
				{
					"attr_id": 605,
					"value": 0
				},
				{
					"attr_id": 606,
					"value": 1
				}
			],
			"nix_brand_name": "Three Jerks",
			"nix_brand_id": "551af50449bbebc5780a61b0",
			"nix_item_name": "Beef Jerky, Chipotle Adobo",
			"nix_item_id": "5556515436f95593518aa94e",
			"metadata": {},
			"source": 8,
			"ndb_no": null,
			"tags": null,
			"alt_measures": null,
			"lat": null,
			"lng": null,
			"photo": {
				"thumb": "https://nutritionix-api.s3.amazonaws.com/555652c40761f2ce5d7e076d.jpeg",
				"highres": null,
				"is_user_uploaded": false
			},
			"note": null,
			"class_code": null,
			"brick_code": null,
			"tag_id": null,
			"updated_at": "2019-01-27T10:39:22+00:00",
			"nf_ingredient_statement": "Beef, Water, Sugar, Less than 2% Salt, Corn Syrup Solids, Dried Soy Sauce (Soybeans, Salt, Wheat), Hydrolyzed Corn and Soy Protein, Monosodium Glutamate, Maltodextrin, Flavorings, Sodium Erythorbate, Sodium Nitrite."
		}
	]
}

// TODO: PUT IN CONFIG FILE
const base_nutritionix_api = "https://trackapi.nutritionix.com/v2/search/item";
const app_id = 'eed60937';
const app_key = '09e865c9a2fbb04be2f1e1de03eb07a4';

export default function App() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [manualUPC, setManualUPC] = useState('');
  const [fullFoodResponse, setFullFoodResponse] = useState<FullFoodResponse>({});
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
      foodContext.foodContextDispatch({type: FoodContextActionTypes.AddFood, payload: {
        name: json["foods"][0]["food_name"],
        brand: json["foods"][0]["brand_name"],
        serving_qty: json["foods"][0]["serving_qty"],
        serving_unit: json["foods"][0]["serving_unit"],
        num_servings: 1,
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
      <ConfirmFood 
        receivedResponse={true}
        foodResponse={exampleResponse["foods"][0]} 
      />
      {/* <TextInput
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
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  scannerContainer: {
    width: '90%',
    height: '40%',
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 15,
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
