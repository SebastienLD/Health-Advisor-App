import { db } from '../firebase/firebaseApp';
import { getDoc, doc, collection, setDoc, addDoc } from 'firebase/firestore';
import { UserInfo } from '../models/UserInfo';
import { defaultDietPreferences } from '../contexts/globalContext';

const USER_COLLECTION = 'userInfo';

const UserInfoFirestoreService = {
  /**
   *  Get the user info for a user from useId
   * @param userId
   */
  getUserInfo: async (userId: string): Promise<UserInfo> => {
    const userInfoDoc = await getDoc(
      doc(collection(db, USER_COLLECTION), userId)
    );
    const userInfo: UserInfo = {
      userId: userInfoDoc.data()?.userId,
      userName: userInfoDoc.data()?.userName,
      heightInInches: userInfoDoc.data()?.heightInInches,
      biologicalSex: userInfoDoc.data()?.biologicalSex,
      // dateOfBirth: userInfoDoc.data()?.dateOfBirth,
      weightInPounds: userInfoDoc.data()?.weightInPounds,
      healthGoal: userInfoDoc.data()?.healthGoal,
      targetMealsPerDay: userInfoDoc.data()?.targetMealsPerDay,
      dietPreferences:
        userInfoDoc.data()?.dietPreferences || defaultDietPreferences,
    };
    return userInfo;
  },
  setUserInfo: async (userInfo: UserInfo): Promise<string> => {
    const ref = await addDoc(collection(db, USER_COLLECTION), userInfo);
    userInfo.userId = ref.id;
    UserInfoFirestoreService.editUserInfo(userInfo);
    return userInfo.userId;
  },
  editUserInfo: async (userInfo: UserInfo) => {
    await setDoc(doc(db, USER_COLLECTION, userInfo.userId), userInfo);
  },
};

export default UserInfoFirestoreService;
