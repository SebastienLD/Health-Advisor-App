import { useState } from 'react';
import { StyleSheet, Image } from 'react-native';
import { Text, View } from './Themed';
import FoodItem, { FoodItemType } from './FoodItem';


type PhotoFromAPI = {
	thumb: string;
	highres: boolean;
	is_user_uploaded: boolean;
}

type FullFoodResponse = {
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
	foodResponse: FullFoodResponse;
	receivedResponse: boolean;
}

const ConfirmFood = (props: ComponentProps) => {
	const { foodResponse, receivedResponse } = props;
	const [servingQty, setServingQty] = useState<number>(foodResponse.serving_qty);
	const [confirmedFoodItem, setConfirmedFoodItem] = useState<FoodItemType>({
		name: foodResponse.food_name,
		brand: foodResponse.brand_name,
		amount: `${foodResponse.serving_qty} ${foodResponse.serving_unit}`,
		calories: foodResponse.nf_calories,
		image: {uri: foodResponse.photo.thumb},
	});

	return (
		<View style={styles.cardContainer}>
			{receivedResponse ? <View>
				<Image
					style={styles.image}
					source={confirmedFoodItem.image}
					resizeMode={"cover"} // <- needs to be "cover" for borderRadius to take effect on Android
				/>
				<Text>{confirmedFoodItem.name}</Text>
				<Text>{confirmedFoodItem.brand}, {confirmedFoodItem.amount}</Text>
				<Text>{confirmedFoodItem.calories} cals</Text>
			</View> :
			<View style={styles.noResponseView}>
				<Text style={styles.noResponseText}>Scan Your Barcode To Add a Food!</Text>
			</View>
			}
		</View>
	)
}

const styles = StyleSheet.create({
	cardContainer: {
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
		width: 60,
		height: 60,
		marginRight: 10,
		borderColor: 'black',
		borderWidth: 1,
		borderRadius: 75
	  },
  });

  export default ConfirmFood;