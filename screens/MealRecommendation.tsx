import { useState, useContext } from 'react';
import { View } from '../components/Themed';
import { Text, TextInput, Pressable, StyleSheet, ScrollView } from 'react-native';
import { GlobalContext } from '../contexts/globalContext';

import OpenAIAPIService from '../services/OpenAIAPIService';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type ComponentProps = NativeStackScreenProps<RootStackParamList>;

const MealRecommendation = ( {navigation, route}: ComponentProps) => {
    const [calories, setCalories] = useState("");
    const [gptResponse, setGPTResponse] = useState("Enter calories and submit to get a recipe");
    const globalContext = useContext(GlobalContext);

    const handleGetResponse = async () => {
        try {
            setGPTResponse("Finding recipe ... ");
            const response = await OpenAIAPIService.getMealRecipe(Number(calories), globalContext.userInfo.healthGoal);
            setGPTResponse(response);
        } catch (e) {
            console.log("Getting open ai response failed with", e);
        }
    }

    return (
        <View>
            <View style={styles.row}>
                <Text style={styles.rowTitle}> User Name</Text>
                <TextInput
                    style={styles.nameInput}
                    onChangeText={(text: string) =>
                        setCalories(text)
                    }
                    value={calories}
                    placeholder="Calories"
                />
            </View>
            <View style={{ alignItems: 'center', marginTop: 10 }}>
                <Pressable 
                    style={styles.saveButton}
                    onPressIn={handleGetResponse}
                >
                    <Text style={{ fontSize: 15 }}>Get recipe</Text>
                </Pressable>
            </View>
            <ScrollView style={styles.response}>
                <Text>{gptResponse}</Text>
            </ScrollView>
        </View>
    )
};

const styles = StyleSheet.create({
    row: {
      flexDirection: 'row',
      display: 'flex',
      justifyContent: 'space-between',
      padding: 8,
      marginBottom: 8,
    },
    response: {
        padding: 15,
        maxHeight: '70%',
        overflow: 'scroll',
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
  });

export default MealRecommendation;