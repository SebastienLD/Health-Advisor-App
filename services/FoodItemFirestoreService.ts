import { db } from '../firebase/firebaseApp';
import {
  collection,
  addDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  deleteDoc,
  doc,
  where,
} from 'firebase/firestore';
import { FoodItem } from '../components/FoodItem';

// Add a new document with a generated id.

const FOOD_INVENTORY_COLLECTION = 'foodInventory';

const FoodItemFirestoreService = {
  uploadFoodItem: async (foodItem: FoodItem) => {
    const docRef = await addDoc(
      collection(db, FOOD_INVENTORY_COLLECTION),
      foodItem
    );
    console.log('Document written with ID: ', docRef.id);
    foodItem.foodItemId = docRef.id;
    FoodItemFirestoreService.editFoodItem(foodItem);
  },
  editFoodItem: async (foodItem: FoodItem) => {
    await setDoc(
      doc(db, FOOD_INVENTORY_COLLECTION, foodItem.foodItemId),
      foodItem
    );
    console.log('Document updated');
  },
  deleteFoodItem: async (foodItem: FoodItem) => {
    await deleteDoc(doc(db, FOOD_INVENTORY_COLLECTION, foodItem.foodItemId));
    console.log('Document deleted from firestore');
  },
  getAllFoodItems: async (userId: string): Promise<Array<FoodItem>> => {
    const queryFoodInvetory = query(
      collection(db, FOOD_INVENTORY_COLLECTION),
      where('userId', '==', userId),
      orderBy('addedToInventory', 'desc')
    );
    const foodInventorySnapshot = await getDocs(queryFoodInvetory);
    let allFoodItems: Array<FoodItem> = [];
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
        userId: doc.data().userId,
      });
    });
    return allFoodItems;
  },
};
export default FoodItemFirestoreService;
