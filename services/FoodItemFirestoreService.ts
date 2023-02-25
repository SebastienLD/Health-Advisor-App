import { db } from '../firebase/firebaseApp';
import { 
    collection,
    addDoc,
    setDoc,
    deleteDoc,
    doc,
 } from "firebase/firestore"; 
import { FoodItem } from '../components/FoodItem';

// Add a new document with a generated id.

const FOOD_INVENTORY_COLLECTION = "foodInvetory";

const FoodItemFirestoreService = {
    

    uploadFoodItem: async (foodItem: FoodItem) => {
        const docRef = await addDoc(collection(db, FOOD_INVENTORY_COLLECTION), foodItem);
        console.log("Document written with ID: ", docRef.id);
        foodItem.foodItemId = docRef.id;
        FoodItemFirestoreService.editFoodItem(foodItem);
    },
    editFoodItem: async (foodItem: FoodItem) => {
        await setDoc(doc(db, FOOD_INVENTORY_COLLECTION, foodItem.foodItemId), foodItem);
        console.log("Document updated");
    },
    deleteFoodItem: async (foodItem: FoodItem) => {
        await deleteDoc(doc(db, FOOD_INVENTORY_COLLECTION, foodItem.foodItemId));
        console.log("Document deleted from firestore")
    },

}
export default FoodItemFirestoreService