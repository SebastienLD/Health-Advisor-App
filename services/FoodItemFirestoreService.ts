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
    QuerySnapshot,
    DocumentData,
    DocumentReference,
    QueryDocumentSnapshot,
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
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dailyFoodItemsDoc = await getDocs(query(
            collection(db, DAILY_FOODS_COLLECTION),
            where("date", "==", Timestamp.fromDate(today)
        )));
        let foodDocPromises: Array<Promise<QuerySnapshot<DocumentData>>> = [];
        dailyFoodItemsDoc.forEach((dailyFoodDoc) => {
            foodDocPromises = foodDocPromises.concat([getDocs(query(collection(db, `${DAILY_FOODS_COLLECTION}/${dailyFoodDoc.id}/${DAILY_FOODS_SUB_COLLECTION}`)))]);
        })
        const foodDocs = await Promise.all(foodDocPromises);
        foodDocs.forEach((snapShot) => {
            snapShot.forEach((foodItemDoc) => {
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
            })
        });
        return allFoodItems;
    },
    eatFoodItem: async (foodItem: FoodItem) => {
        // first delete the food item from the inventory
        await deleteDoc(doc(db, FOOD_INVENTORY_COLLECTION, foodItem.foodItemId));
        console.log("Deleted document from food inventory, moving to daily");
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const queryDocs = await getDocs(query(
            collection(db, DAILY_FOODS_COLLECTION),
            where("date", "==", Timestamp.fromDate(today)
        )));
        if (!queryDocs.empty) {
            let promises: Array<Promise<DocumentData>> = [];
            queryDocs.forEach((doc) => {
                promises.concat([addDoc(collection(db, `${DAILY_FOODS_COLLECTION}/${doc.id}/${DAILY_FOODS_SUB_COLLECTION}`), foodItem)]);
            });
            await Promise.all(promises);
        } else {
            const addedDoc = await addDoc(collection(db, DAILY_FOODS_COLLECTION), {date: Timestamp.fromDate(today)});
            await addDoc(collection(db, `${DAILY_FOODS_COLLECTION}/${addedDoc.id}/${DAILY_FOODS_SUB_COLLECTION}`), foodItem);
        }
        console.log("Added food item to daily food sub collection");
    },
}
export default FoodItemFirestoreService