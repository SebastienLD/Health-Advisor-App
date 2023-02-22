import { db } from '../firebase/firebaseApp';
import { 
    collection,
    addDoc,
    getDocs,
    orderBy,
    query,
    setDoc,
    deleteDoc,
    getDoc,
    doc,
    Timestamp,
    where,
 } from "firebase/firestore"; 
import { FoodItem } from '../components/FoodItem';

// Add a new document with a generated id.

const FOOD_INVENTORY_COLLECTION = "foodInvetory";
const DAILY_FOODS_COLLECTION = "dailyFoods";
const DAILY_FOODS_SUB_COLLECTION = "dailyFoodItems";

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
    getAllFoodItems: async () : Promise<Array<FoodItem>> => {
        const queryFoodInvetory = query(collection(db, FOOD_INVENTORY_COLLECTION), orderBy("addedToInventory", "desc"));
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
            });
        });
        return allFoodItems;
    },
    // TODO: THIS FUNCTION DOESN'T WORK QUITE RIGHT YET
    getTodaysDailyFoods: async () : Promise<Array<FoodItem>> => {
        let allFoodItems: Array<FoodItem> = [];
        console.log("Trying to get today's daily foods");
        const dailyFoodItemsDoc = await getDocs(query(collection(db, DAILY_FOODS_COLLECTION), where("date", "<=", Timestamp.fromDate(new Date()))));
        dailyFoodItemsDoc.forEach(async (dailyDoc) => {
            console.log("Found a specific daily doc with date: ", dailyDoc.data().date);
            const foodItemDocs = await getDocs(query(collection(db, `${DAILY_FOODS_COLLECTION}/${dailyDoc.id}/${DAILY_FOODS_SUB_COLLECTION}`)));
            foodItemDocs.forEach((foodItemDoc) => {
                console.log("Found a specific food inside the daily doc", foodItemDoc.data().name);
                allFoodItems = allFoodItems.concat({
                    foodItemId: foodItemDoc.id,
                    name: foodItemDoc.data().name,
                    brand: foodItemDoc.data().brand,
                    serving_qty: foodItemDoc.data().serving_qty,
                    serving_unit: foodItemDoc.data().serving_unit,
                    num_servings: foodItemDoc.data().num_servings,
                    image: foodItemDoc.data().image,
                    calories: foodItemDoc.data().calories,
                    protein: foodItemDoc.data().protein,
                    fat: foodItemDoc.data().fat,
                    carbs: foodItemDoc.data().carbs,
                    addedToInventory: foodItemDoc.data().addedToInventory,
                });
            });
        });
        return allFoodItems;
    },
    eatFoodItem: async (foodItem: FoodItem) => {
        // first delete the food item from the inventory
        await deleteDoc(doc(db, FOOD_INVENTORY_COLLECTION, foodItem.foodItemId));
        console.log("Deleted document from food inventory, moving to daily");
        const todayDoc = await addDoc(collection(db, DAILY_FOODS_COLLECTION), {date: Timestamp.fromDate(new Date())});
        console.log("Added daily food doc");
        await addDoc(collection(db, `${DAILY_FOODS_COLLECTION}/${todayDoc.id}/${DAILY_FOODS_SUB_COLLECTION}`), foodItem);
        console.log("Added food item to daily food sub collection");
    },
}
export default FoodItemFirestoreService