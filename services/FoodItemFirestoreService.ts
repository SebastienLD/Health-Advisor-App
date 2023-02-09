import firestore from '@react-native-firebase/firestore';


const FoodItemFirestoreService = {
   uploadFoodItem: () => {
        const usersCollection = firestore().collection('Users');
    }
    
}
export default FoodItemFirestoreService