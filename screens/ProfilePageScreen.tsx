import { useEffect, useContext, useState } from 'react';
import { TextInput, StyleSheet, Text, Pressable } from 'react-native';
import { View } from '../components/Themed';
import { GlobalContext } from '../contexts/globalContext';
import UserInfoFirestoreService from '../services/UserInfoFirestoreService';
import { BiologicalSex, HealthGoal, UserInfo } from '../models/UserInfo';
import SelectDropdown from 'react-native-select-dropdown';
import { mockUserInfo } from '../contexts/globalContext';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { UserInfoActionTypes } from '../contexts/userInfoReducers';
import LocalAsyncStorageService from '../services/LocalAsyncStorageService';

type ComponentProps = NativeStackScreenProps<
  RootStackParamList,
  'ProfilePageScreen'
>;

const ProfilePageScreen = ({ navigation, route }: ComponentProps) => {
  const globalContext = useContext(GlobalContext);
  const [thisUserInfo, setThisUserInfo] = useState<UserInfo>(mockUserInfo);

  const handleSaveProfile = async () => {
    let userId = "";
    if (globalContext.userInfo.userId === "MOCK_USER_ID") {
      try {
        userId = await UserInfoFirestoreService.setUserInfo(thisUserInfo);
        console.log("Just sent user info to firebase, got userId ", userId);
      } catch (e) {
        console.log("Adding new userinfo to firestore failed: ", e);
      }
    } else {
      try {
        await UserInfoFirestoreService.editUserInfo(thisUserInfo);
        userId = thisUserInfo.userId;
      } catch (e) {
        console.log("Editing the userinfo in firestore failed: ", e);
      }
    }
    globalContext.userInfoDispatch({
      type: UserInfoActionTypes.UpdateUserInfo,
      payload: {
        ...thisUserInfo,
        userId: userId
      },
    });
    LocalAsyncStorageService.saveUserToDisk(userId, thisUserInfo.userName)
    navigation.navigate("Root");
  }
  
  useEffect(() => {
    setThisUserInfo(globalContext.userInfo);
  }, [globalContext.userInfo]);
  
  useEffect(() => {
    const setUserInfoFromFirestore = async () => {
      const userId = await LocalAsyncStorageService.getUserFromDisk();
      console.log("Got user id from local async", userId);
      if (userId !== null) {
        const userInfo = await UserInfoFirestoreService.getUserInfo(
          userId.userId
        );
        globalContext.userInfoDispatch({
          type: UserInfoActionTypes.UpdateUserInfo,
          payload: userInfo,
        });
      }
    };

    if (globalContext.userInfo.userId == 'MOCK_USER_ID') {
      setUserInfoFromFirestore();
    }
  }, []);

  const Boarder = () => {
    return (
      <View
        style={{
          borderBottomColor: 'black',
          borderBottomWidth: StyleSheet.hairlineWidth,
          marginBottom: 10,
        }}
      />
    )
  }

  return (
    <View style={{ padding: 10 }}>
      <View style={styles.row}>
        <Text style={styles.rowTitle}> User Name</Text>
        <TextInput
          style={styles.nameInput}
          onChangeText={(text: string) =>
            setThisUserInfo({ ...thisUserInfo, userName: text })
          }
          value={thisUserInfo.userName}
          placeholder="User Name"
        />
      </View>
     <Boarder/>
     <View style={styles.row}>
        <Text style={styles.rowTitle}> Height (inches) </Text>
        <SelectDropdown
          buttonStyle={styles.dropDown}
          data={[...Array(40).keys()].map(i => i + 48)}
          onSelect={(selectedItem, index) => {
            setThisUserInfo({
              ...thisUserInfo,
              heightInInches: selectedItem,
            });
          }}
          defaultValue={thisUserInfo.heightInInches}
          defaultButtonText="Select"
        />
      </View>
      <Boarder/>
      <View style={styles.row}>
        <Text style={styles.rowTitle}> Weight (lbs) </Text>
        <SelectDropdown
          buttonStyle={styles.dropDown}
          data={[...Array(300).keys()].map(i => i + 95)}
          onSelect={(selectedItem, index) => {
            setThisUserInfo({
              ...thisUserInfo,
              weightInPounds: selectedItem,
            });
          }}
          defaultValue={thisUserInfo.weightInPounds}
          defaultButtonText="Select"
        />
      </View>
      <Boarder/>
      <View style={styles.row}>
        <Text style={styles.rowTitle}> Biological Sex </Text>
        <SelectDropdown
          buttonStyle={styles.dropDown}
          data={[BiologicalSex.male, BiologicalSex.female]}
          onSelect={(selectedItem, index) => {
            setThisUserInfo({
              ...thisUserInfo,
              biologicalSex: selectedItem,
            });
          }}
          defaultValue={thisUserInfo.biologicalSex}
          defaultButtonText="Select"
        />
      </View>
      <Boarder/>
      <View style={styles.row}>
        <Text style={styles.rowTitle}> Health Goal </Text>
        <SelectDropdown
          buttonStyle={styles.dropDown}
          data={[HealthGoal.lose_fat, HealthGoal.gain_muscle, HealthGoal.maintain_weight]}
          onSelect={(selectedItem, index) => {
            setThisUserInfo({
              ...thisUserInfo,
              healthGoal: selectedItem,
            });
          }}
          defaultValue={thisUserInfo.healthGoal}
          defaultButtonText="Select"
        />
      </View>
      <Boarder/>
      <View style={styles.row}>
        <Text style={styles.rowTitle}> Target # of Meals / Day </Text>
        <SelectDropdown
          buttonStyle={styles.dropDown}
          data={[1, 2, 3, 4]}
          onSelect={(selectedItem, index) => {
            setThisUserInfo({
              ...thisUserInfo,
              targetMealsPerDay: selectedItem,
            });
          }}
          defaultValue={thisUserInfo.targetMealsPerDay}
          defaultButtonText="Select"
        />
      </View>
      <Boarder/>
      <View style={{ alignItems: 'center', marginTop: 10 }}>
        <Pressable 
          style={styles.saveButton}
          onPressIn={handleSaveProfile}
        >
          <Text style={{ fontSize: 15 }}>Save</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'space-between',
    padding: 8,
    marginBottom: 8,
  },
  rowTitle: {
    marginTop: 8,
  },
  nameInput: {
    width: '40%',
    textAlign: 'center',
    height: 40,
    marginRight: 5,
    marginTop: 5,
    borderWidth: 1,
    padding: 10,
  },
  heightInput: {
    textAlign: 'center',
    width: '12%',
    height: 40,
    marginRight: 5,
    marginTop: 5,
    borderWidth: 1,
  },
  saveButton: {
    alignItems: 'center',
    width: 100,
    borderWidth: 1,
    borderRadius: 10,
    padding: 5,
    borderColor: 'black',
    backgroundColor: '#FFFFFF',
    marginTop: 10,
    marginBottom: 20,
  },
  dropDown: {
    width: '40%',
    height: 40,
    marginRight: 5,
    marginTop: 5,
    borderWidth: 1,
    padding: 10,
    backgroundColor: 'white',
  },
  line: {
    borderBottomColor: 'black',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 10,
  },
});

export default ProfilePageScreen;
