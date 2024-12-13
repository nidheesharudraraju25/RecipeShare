import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';

interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
}

const mockIngredients: Ingredient[] = [
  { id: '1', name: 'Chicken', quantity: 1, unit: 'kg' },
  { id: '2', name: 'Rice', quantity: 500, unit: 'g' },
  { id: '3', name: 'Tomato', quantity: 3, unit: 'pcs' },
];

const ShoppingListScreen: React.FC = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>(mockIngredients);
  const [servings, setServings] = useState<number>(1);

  const handleAdjustServings = (newServings: number) => {
    if (newServings <= 0) {
      Alert.alert('Error', 'Servings must be greater than 0.');
      return;
    }

    const adjustedIngredients = ingredients.map((ingredient) => ({
      ...ingredient,
      quantity: (ingredient.quantity / servings) * newServings,
    }));

    setIngredients(adjustedIngredients);
    setServings(newServings);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shopping List</Text>

      {/* Serving Adjustment */}
      <View style={styles.servingContainer}>
        <Text style={styles.servingLabel}>Adjust Servings:</Text>
        <TextInput
          style={styles.input}
          keyboardType="number-pad"
          value={servings.toString()}
          onChangeText={(value) => handleAdjustServings(Number(value))}
        />
      </View>

      {/* Ingredient List */}
      <FlatList
        data={ingredients}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.ingredientItem}>
            <Text>{item.name}</Text>
            <Text>{`${item.quantity} ${item.unit}`}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No ingredients in the shopping list.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 16 },
  servingContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  servingLabel: { fontSize: 16, marginRight: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 4,
    width: 50,
    textAlign: 'center',
  },
  ingredientItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginBottom: 8,
    backgroundColor: '#f9f9f9',
  },
  emptyText: { textAlign: 'center', fontStyle: 'italic', color: '#999' },
});

export default ShoppingListScreen;
