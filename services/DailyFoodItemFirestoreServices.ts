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
    Timestamp,
    where,
    QuerySnapshot,
    DocumentData,
    updateDoc,
    arrayUnion
 } from "firebase/firestore"; 
import { FoodItem } from '../components/FoodItem';

// Add a new document with a generated id.

const FOOD_INVENTORY_COLLECTION = "foodInvetory";
const DAILY_FOODS_COLLECTION = "dailyFoods";

const DailyFoodItemFirestoreService = {
    
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
        
        if(queryDocs.empty) {
            const ref = await addDoc(collection(db, DAILY_FOODS_COLLECTION), {date: Timestamp.fromDate(today)});
            updateDoc(ref, 
                {
                    foodAte: arrayUnion(foodItem)
                })
        }
        else{
            queryDocs.forEach((doc) => {
                // doc.data() is never undefined for query doc snapshots
                const ref = doc.ref
                updateDoc(ref, 
                    {
                        foodAte: arrayUnion(foodItem)
                    })
              });
        }
        console.log("Added food item to daily food sub collection");
    },

    getTodaysDailyFoods: async () : Promise<Array<FoodItem>> => {
        const allFoodItems: Array<FoodItem> = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dailyFoodItemDocs = await getDocs(query(
            collection(db, DAILY_FOODS_COLLECTION),
            where("date", "==", Timestamp.fromDate(today)
        )));
        
        dailyFoodItemDocs.forEach((doc) => {
            allFoodItems.concat(doc.data().foodAte)
        })
        
        return allFoodItems;
    },

}
export default DailyFoodItemFirestoreService