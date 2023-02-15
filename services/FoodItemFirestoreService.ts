import { db } from '../firebase/firebaseApp';
import { collection, addDoc, getDocs, orderBy, query } from "firebase/firestore"; 
import { FoodItemType } from '../components/FoodItem';

// Add a new document with a generated id.

const FOOD_INVENTORY_COLLECTION = "foodInvetory";

const FoodItemFirestoreService = {
    uploadFoodItem: async (foodItem: FoodItemType) => {
        const docRef = await addDoc(collection(db, FOOD_INVENTORY_COLLECTION), foodItem);
        console.log("Document written with ID: ", docRef.id);
    },
    getAllFoodItems: async () : Promise<Array<FoodItemType>> => {
        const queryFoodInvetory = query(collection(db, FOOD_INVENTORY_COLLECTION), orderBy("addedToInventory", "desc"));
        const foodInventorySnapshot = await getDocs(queryFoodInvetory);
        let allFoodItems: Array<FoodItemType> = [];
        foodInventorySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
            allFoodItems = allFoodItems.concat({
                foodItemId: doc.id,
                name: doc.data().name,
                brand: doc.data().brand,
                serving_qty: doc.data().serving_qty,
                serving_unit: doc.data().serving_unit,
                num_servings: doc.data().num_servings,
                image: doc.data().image,
                calories: doc.data().calories,
                protein: doc.data().protein,
                fat: doc.data().fat,
                carbs: doc.data().carbs,
                addedToInventory: doc.data().addedToInventory,
            });
        });
        return allFoodItems;
    },
}
export default FoodItemFirestoreService