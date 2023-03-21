import { useEffect, useContext, useState } from 'react';
import { StyleSheet, Text, Pressable, Modal } from 'react-native';
import { View } from '../components/Themed';
import { defaultDietPreferences, GlobalContext } from '../contexts/globalContext';
import UserInfoFirestoreService from '../services/UserInfoFirestoreService';
import { UserDietPreferences } from '../models/UserInfo';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, RootTabParamList } from '../types';
import { UserInfoActionTypes } from '../contexts/userInfoReducers';
import LocalAsyncStorageService from '../services/LocalAsyncStorageService';
import Checkbox from "expo-checkbox";

type ComponentProps = NativeStackScreenProps<
  RootStackParamList,
  'PreferencesScreen'
>;

const PreferencesScreen = ({ navigation, route }: ComponentProps) => {
  const globalContext = useContext(GlobalContext);
  const [dietPreferences, setDietPreferences] = useState<UserDietPreferences>(defaultDietPreferences);

  const handleSaveProfile = async () => {
    try {
        await UserInfoFirestoreService.editUserInfo({
            ...globalContext.userInfo,
            dietPreferences: dietPreferences
        })
    } catch (e) {
        console.log("Editing the userinfo in firestore failed: ", e);
    }
    globalContext.userInfoDispatch({
      type: UserInfoActionTypes.UpdateUserInfo,
      payload: {
        ...globalContext.userInfo,
        dietPreferences: dietPreferences
      },
    });
    navigation.navigate("Root");
  }
  
  useEffect(() => {
    setDietPreferences(globalContext.userInfo.dietPreferences);
  }, [globalContext.userInfo.dietPreferences]);
  
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

  const Border = () => {
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
      {(globalContext.userInfo.userId === "MOCK_USER_ID") ? 
        <Modal
            animationType="slide"
            transparent={true}
            visible={true}
            onRequestClose={() => {
                navigation.navigate("Root")
            }}>
            <View style={styles.centeredView}>
            <View style={styles.modalView}>
                <Text style={styles.modalText}>
                    Uh oh! You must create a profile before adding dietary preferences!
                </Text>
                <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => navigation.navigate("Root")}>
                <Text style={styles.textStyle}>Go Back</Text>
                </Pressable>
            </View>
            </View>
        </Modal> : 
        <>
        <View style={styles.row}>
            <Text style={styles.rowTitle}>Lactose Intolerant</Text>
            <Checkbox value={dietPreferences.isLactoseIntolerant} onValueChange={
                () => setDietPreferences({
                    ...dietPreferences,
                    isLactoseIntolerant: !dietPreferences.isLactoseIntolerant,
                })
            }/>
        </View>
        <Border/>
        <View style={styles.row}>
            <Text style={styles.rowTitle}>Gluten Intolerant</Text>
            <Checkbox value={dietPreferences.isGlutenFree} onValueChange={
                () => setDietPreferences({
                    ...dietPreferences,
                    isGlutenFree: !dietPreferences.isGlutenFree,
                })
            }/>
        </View>
        <Border/>
        <View style={styles.row}>
            <Text style={styles.rowTitle}>Vegitarian</Text>
            <Checkbox value={dietPreferences.isVeg} onValueChange={
                () => setDietPreferences({
                    ...dietPreferences,
                    isVeg: !dietPreferences.isVeg,
                })
            }/>
        </View>
        <Border/>
        <View style={styles.row}>
            <Text style={styles.rowTitle}>Kosher</Text>
            <Checkbox value={dietPreferences.isKosher} onValueChange={
                () => setDietPreferences({
                    ...dietPreferences,
                    isKosher: !dietPreferences.isKosher,
                })
            }/>
        </View>
        <Border/>
        <View style={styles.row}>
            <Text style={styles.rowTitle}>Keto</Text>
            <Checkbox value={dietPreferences.isKeto} onValueChange={
                () => setDietPreferences({
                    ...dietPreferences,
                    isKeto: !dietPreferences.isKeto,
                })
            }/>
        </View>
        <Border/>
        <View style={styles.row}>
            <Text style={styles.rowTitle}>Diabetes</Text>
            <Checkbox value={dietPreferences.hasDiabetes} onValueChange={
                () => setDietPreferences({
                    ...dietPreferences,
                    hasDiabetes: !dietPreferences.hasDiabetes,
                })
            }/>
        </View>
        <Border/>
        <View style={styles.row}>
            <Text style={styles.rowTitle}>Dairy Free</Text>
            <Checkbox value={dietPreferences.isDairyFree} onValueChange={
                () => setDietPreferences({
                    ...dietPreferences,
                    isDairyFree: !dietPreferences.isDairyFree,
                })
            }/>
        </View>
        <Border/>
        <View style={styles.row}>
            <Text style={styles.rowTitle}>Low Carb</Text>
            <Checkbox value={dietPreferences.isLowCarb} onValueChange={
                () => setDietPreferences({
                    ...dietPreferences,
                    isLowCarb: !dietPreferences.isLowCarb,
                })
            }/>
        </View>
        <Border/>
        <View style={{ alignItems: 'center', marginTop: 10 }}>
            <Pressable 
            style={styles.saveButton}
            onPressIn={handleSaveProfile}
            >
            <Text style={{ fontSize: 15 }}>Save</Text>
            </Pressable>
        </View>
        </>
    }
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  rowTitle: {
    marginTop: 8,
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
  line: {
    borderBottomColor: 'black',
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 10,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default PreferencesScreen;
