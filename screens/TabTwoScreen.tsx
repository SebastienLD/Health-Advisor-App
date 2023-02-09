import { Button, StyleSheet } from 'react-native';
import { Text, View } from '../components/Themed';

import FoodItemFirestoreService from '../services/FoodItemFirestoreService';

export default function TabTwoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab Two</Text>
      <Button onPress={onTest} title="Test Firebase" ></Button>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
    </View>
  );
}

const onTest = () => {
  FoodItemFirestoreService.uploadFoodItem()
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
