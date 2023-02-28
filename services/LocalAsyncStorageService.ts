import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_DATA_KEY = 'USER_DATA';

type LocalUserData = {
  userId: string;
  userName: string;
};

const LocalAsyncStorageService = {
  /**
   * Set userId and userName to local async storage
   * @param userId
   * @param userName
   */
  saveUserToDisk: async (userId: string, userName: string) => {
    const userObj: LocalUserData = {
      userId: userId,
      userName: userName,
    };
    const strUserObj = JSON.stringify(userObj);
    try {
      await AsyncStorage.setItem(USER_DATA_KEY, strUserObj);
    } catch (e) {
      console.log('Saving user to disk failed: ', e);
    }
  },
  getUserFromDisk: async (): Promise<LocalUserData | null> => {
    try {
      const jsonValue = await AsyncStorage.getItem('@storage_Key');
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.log('Error getting user data from disk: ', e);
      return null;
    }
  },
};

export default LocalAsyncStorageService;
