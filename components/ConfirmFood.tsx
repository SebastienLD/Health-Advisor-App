import { useEffect, useState } from 'react';
import { StyleSheet, Image, TextInput } from 'react-native';
import { Text, View } from './Themed';
import { FoodItemType } from './FoodItem';
import Ionicons from '@expo/vector-icons/Ionicons';
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

type ComponentProps = {
	foodResponse: FullFoodResponse | undefined;
	receivedResponse: boolean;
	handleConfirmFood: (confirmedFoodItem: FoodItemType) => void;
	scanned: boolean;
}

const ConfirmFood = (props: ComponentProps) => {
	const { foodResponse, receivedResponse, handleConfirmFood, scanned } = props;
	const [numServings, setNumServings] = useState<string>("1");

	const [confirmedFoodItem, setConfirmedFoodItem] = useState<FoodItemType>({
		foodItemId: "",
		name: "No Item",
		brand: "",
		serving_qty: 1,
		serving_unit: "",
		num_servings: NaN,
		calories: NaN,
		image: {uri: undefined},
		protein: NaN,
		fat: NaN,
		carbs: NaN,
		addedToInventory: NaN,
	});

	useEffect(() => {
		if (receivedResponse && foodResponse) {
			setConfirmedFoodItem({
				foodItemId: String(uuid.v4()),
				name: foodResponse.food_name,
				brand: foodResponse.brand_name,
				serving_qty: foodResponse.serving_qty,
				serving_unit: foodResponse.serving_unit,
				num_servings: 1,
				calories: foodResponse.nf_calories,
				image: {uri: foodResponse.photo.thumb},
				protein: foodResponse.nf_protein,
				fat: foodResponse.nf_total_fat,
				carbs: foodResponse.nf_total_carbohydrate,
				addedToInventory: Date.now(),
			})
		}
	}, [receivedResponse, foodResponse]);

	const handleUpdateServingQty = (num_servings: string) => {
		setNumServings(num_servings);
		if (num_servings == "") {
			return;
		};
		setConfirmedFoodItem({
			...confirmedFoodItem,
			num_servings: Number(num_servings),
		})
	}

	return (
		<View style={styles.cardContainer}>
			<View>
				<View style={{flexDirection: "row", display: "flex", justifyContent: "space-between"}}>
					<Image
						style={styles.image}
						source={confirmedFoodItem.image}
						resizeMode={"cover"} // <- needs to be "cover" for borderRadius to take effect on Android
					/>
					<View style={{flexDirection: "column", top: 6, marginRight: 22}}>
						<Text style={{fontSize: 16, maxWidth: 200}}>{confirmedFoodItem.name}</Text>
						<Text style={{fontSize: 14}}>{confirmedFoodItem.brand}</Text>
					</View>
					<Ionicons
						onPress={() => handleConfirmFood(confirmedFoodItem)}
						name="md-checkmark-circle" 
						size={32} 
					/>
				</View>
				<View style={{flexDirection: "row", display: "flex", justifyContent: "space-between"}}>
					<Text style={{top: 15}}>Number of servings {confirmedFoodItem.serving_qty.toFixed(2)} {confirmedFoodItem.serving_unit} ea.)</Text>
					<View style={styles.input}>
						<TextInput
							style={{textAlign: "right"}}
							value={String(numServings)}
							onChangeText={handleUpdateServingQty}
							placeholderTextColor="#60605e"
							keyboardType={'numeric'}
							autoFocus={scanned}
						/>
					</View>
				</View>
				<View style={{flexDirection: "row", marginTop: 15, display: "flex", justifyContent: "space-between"}}>
					<Text>Calories</Text>
					<Text>{confirmedFoodItem.calories * confirmedFoodItem.num_servings} kcal</Text>
				</View>
				<View style={{flexDirection: "row", marginTop: 15, display: "flex", justifyContent: "space-between"}}>
					<Text>Protien</Text>
					<Text>{confirmedFoodItem.protein * confirmedFoodItem.num_servings} g</Text>
				</View>
				<View style={{flexDirection: "row", marginTop: 15, display: "flex", justifyContent: "space-between"}}>
					<Text>Fat</Text>
					<Text>{confirmedFoodItem.fat * confirmedFoodItem.num_servings} g</Text>
				</View>
				<View style={{flexDirection: "row", marginTop: 15, display: "flex", justifyContent: "space-between"}}>
					<Text>Carbs</Text>
					<Text>{confirmedFoodItem.carbs * confirmedFoodItem.num_servings} g</Text>
				</View>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	cardContainer: {
		marginTop: 15,
		padding: 10,
		width: '90%',
		height: '45%',
		borderRadius: 15,
		borderColor: "black",
		borderWidth: 1,
		backgroundColor: 'white',
	},
	noResponseView: {
		alignItems: 'center',
	},
	noResponseText: {
		fontWeight: '400',
		fontSize: 20,
	},
	image: {
		width: 50,
		height: 50,
		marginRight: 10,
		borderColor: 'black',
		borderWidth: 1,
		borderRadius: 75
	},
	input: {
		height: 40,
		marginRight: 5,
		marginTop: 5,
		width: 50,
		borderWidth: 1,
		padding: 10,
	},
  });

  export default ConfirmFood;