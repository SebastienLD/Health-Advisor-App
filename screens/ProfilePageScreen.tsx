import { useEffect, useContext, useState } from 'react';
import { TextInput, StyleSheet, Text, Pressable } from 'react-native';
import { View } from '../components/Themed';
import { GlobalContext } from '../contexts/globalContext';
import UserInfoFirestoreService from '../services/UserInfoFirestoreService';
import { BiologicalSex, UserInfo } from '../models/UserInfo';
import SelectDropdown from 'react-native-select-dropdown';
import { mockUserInfo } from '../contexts/globalContext';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { UserInfoActionTypes } from '../contexts/userInfoReducers';
import LocalAsyncStorageService from '../services/LocalAsyncStorageService';

type ComponentProps = NativeStackScreenProps<RootStackParamList, "ProfilePageScreen">;

const ProfilePageScreen = ( {navigation, route}: ComponentProps) => {

    const globalContext = useContext(GlobalContext);
    const [thisUserInfo, setThisUserInfo] = useState<UserInfo>(mockUserInfo);

    useEffect(() => {
        setThisUserInfo(globalContext.userInfo);
    }, [globalContext.userInfo])

    useEffect(() => {

        const setUserInfoFromFirestore = async () => {
            const userId = await LocalAsyncStorageService.getUserFromDisk();
            if (userId !== null) {
                const userInfo = await UserInfoFirestoreService.getUserInfo(userId.userId);
                globalContext.userInfoDispatch({
                    type: UserInfoActionTypes.UpdateUserInfo,
                    payload: userInfo
                });
            }
        }

        if (globalContext.userInfo.userId == "MOCK_USER_ID") {
            setUserInfoFromFirestore();
        }
    }, []);

    return (
        <View style={{padding: 15}}>
            <View style={styles.row}>
                <Text> User Name</Text>
                <TextInput 
                    style={styles.nameInput}
                    onChangeText={(text: string) => setThisUserInfo({...thisUserInfo, userName: text})}
                    value={thisUserInfo.userName}
                    placeholder="User Name"
                />
            </View>
            <View
                style={{
                    borderBottomColor: 'black',
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    marginBottom: 10,
                }}
            />
            <View style={styles.row}>
                <Text> Height </Text>
                <TextInput 
                    style={styles.heightInput}
                    onChangeText={(text: string) => setThisUserInfo({...thisUserInfo, heightInInches: Number(text)})}
                    value={String(thisUserInfo.heightInInches)}
                    keyboardType={'numeric'}
                    placeholder="Height In Inches"
                />
            </View>
            <View style={styles.row}>
                <Text> Biological Sex </Text>
                <SelectDropdown
                    buttonStyle={styles.dropDown}
                    data={[BiologicalSex.male, BiologicalSex.female]}
                    onSelect={(selectedItem, index) => {
                        setThisUserInfo({
                            ...thisUserInfo,
                            biologicalSex: selectedItem
                        })
                    }}
                    defaultButtonText="Select"
                />
            </View>
            <View style={{alignItems: 'center', marginTop: 10}}>
                <Pressable style={styles.saveButton}>
                    <Text style={{fontSize: 15}}>Save</Text>
                </Pressable>
            </View>
        </View>
    );

};

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        display: "flex",
        justifyContent: "space-between",
    },
    nameInput: {
        width: "40%",
        height: 40,
		marginRight: 5,
		marginTop: 5,
		borderWidth: 1,
		padding: 10
    },
    heightInput: {
        textAlign: "right",
        width: "12%",
        height: 40,
		marginRight: 5,
		marginTop: 5,
		borderWidth: 1,
		padding: 10
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
    },
    dropDown: {
        width: "40%",
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
    }
})

export default ProfilePageScreen;