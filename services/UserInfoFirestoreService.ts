import { db } from '../firebase/firebaseApp';
import { getDoc, doc, collection, setDoc, addDoc } from 'firebase/firestore';
import { UserInfo } from "../models/UserInfo"

const USER_COLLECTION = "users";

const UserInfoFirestoreService = {

    /**
     *  Get the user info for a user from useId
     * @param userId
     */
    getUserInfo: async (userId: string): Promise<UserInfo> => {
        const userInfoDoc = await getDoc(doc(collection(db, USER_COLLECTION), userId));
        const userInfo: UserInfo = {
            userId: userInfoDoc.data()?.userId,
            userName: userInfoDoc.data()?.userName,
            heightInInches: userInfoDoc.data()?.heightInInches,
            biologicalSex: userInfoDoc.data()?.biologicalSex,
            dateOfBirth: userInfoDoc.data()?.dateOfBirth,
        }
        return userInfo;
    },
    setUserInfo: async (userInfo: UserInfo) => {
        const ref = await addDoc(collection(db, USER_COLLECTION), userInfo);
        userInfo.userId = ref.id;
        UserInfoFirestoreService.editUserInfo(userInfo);
    },
    editUserInfo: async (userInfo: UserInfo) => {
        await setDoc(doc(db, USER_COLLECTION, userInfo.userId), userInfo);
    },
};

export default UserInfoFirestoreService;