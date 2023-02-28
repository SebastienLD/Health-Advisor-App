import { db } from '../firebase/firebaseApp';
import {
  collection,
  addDoc,
  getDocs,
  query,
  deleteDoc,
  doc,
  Timestamp,
  where,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { FoodItem } from '../components/FoodItem';

// Add a new document with a generated id.

const FOOD_INVENTORY_COLLECTION = 'foodInventory';
const DAILY_FOODS_COLLECTION = 'dailyFoods';

const DailyFoodItemFirestoreService = {
  /**
   * Deletes a food item from invenotry and adds it to todays dailyFood foodAte field
   * @param foodItem
   */
  eatFoodItem: async (foodItem: FoodItem) => {
    // first delete the food item from the inventory
    await deleteDoc(doc(db, FOOD_INVENTORY_COLLECTION, foodItem.foodItemId));
    console.log('Deleted document from food inventory, moving to daily');

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const queryDocs = await getDocs(
      query(
        collection(db, DAILY_FOODS_COLLECTION),
        where('date', '==', Timestamp.fromDate(today))
      )
    );
    if (queryDocs.empty) {
      const ref = await addDoc(collection(db, DAILY_FOODS_COLLECTION), {
        date: Timestamp.fromDate(today),
      });
      updateDoc(ref, {
        foodAte: arrayUnion(foodItem),
      });
    } else {
      queryDocs.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        const ref = doc.ref;
        updateDoc(ref, {
          foodAte: arrayUnion(foodItem),
        });
      });
    }
    console.log('Added food item to daily food sub collection');
  },

  getTodaysDailyFoods: async (): Promise<Array<FoodItem>> => {
    let allFoodItems: Array<FoodItem> = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dailyFoodItemDocs = await getDocs(
      query(
        collection(db, DAILY_FOODS_COLLECTION),
        where('date', '==', Timestamp.fromDate(today))
      )
    );

    dailyFoodItemDocs.forEach((doc) => {
      console.log('HERE');
      console.log(doc.data().foodAte);
      allFoodItems = allFoodItems.concat(doc.data().foodAte);
    });
    console.log(allFoodItems);
    return allFoodItems;
  },

  /**
   * Removes a food item from the AteFood field in dailyFoods doc
   * @returns
   */
  removeDailyFoodItem: async (foodItem: FoodItem) => {
    const today = new Date();
    const queryDocs = await getDocs(
      query(
        collection(db, DAILY_FOODS_COLLECTION),
        where('date', '==', Timestamp.fromDate(today))
      )
    );

    queryDocs.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      const ref = doc.ref;
      updateDoc(ref, {
        foodAte: arrayRemove(foodItem),
      });
    });
  },
};
export default DailyFoodItemFirestoreService;
