import { StyleSheet, Button, TextInput } from 'react-native';
import { useState } from 'react';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';

import * as React from 'react';

const base_search_api = "https://api.nal.usda.gov/fdc/v1/foods/search?api_key=DEMO_KEY&pageSize=5";

type FoodNutrient = {
  number: number;
  name: string;
  amount: number;
  unitName: string;
}

type FoodResult = {
  description: string;
  brandOwner: string;
  foodNutrients: Array<FoodNutrient>;
}

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {

  const [searchName, setSearchName] = useState("");
  const [foodResults, setsFoodResults] = useState<Array<FoodResult>>([]);

  const makeFoodQuery = async () => {
    try {
      const api = base_search_api + `&query=${searchName.replace(/\s/g, "%")}`;
      console.log("Resulting api was", api);
      const response = await fetch(api);
      const json = await response.json();
      setsFoodResults(json["foods"]);
    } catch (error) {
      console.error(error);
    }
  }
  console.log(foodResults);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Search for a food.</Text>
      <TextInput
        style={styles.input}
        onChangeText={setSearchName}
        value={searchName}
        placeholder={"Type of food"}
      />
      <Button
        title="Fetch"
        onPress={() => {
          makeFoodQuery();
        }}
      />
      {
        foodResults?.map((food, index) => {
          return <Text key={index}>{food["description"]}</Text>
        })
      }
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
  input: {
    width: '70%',
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

