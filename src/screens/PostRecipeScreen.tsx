import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { db, addDoc, collection } from '../config/firebaseConfig'; // Firebase setup

const PostRecipeScreen: React.FC = () => {
  const [recipeName, setRecipeName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const handlePostRecipe = async () => {
    if (!recipeName || !ingredients || !instructions ) {
      Alert.alert('Error', 'All fields must be filled out.');
      return;
    }

    try {
      // Add recipe data to Firestore
      const docRef = await addDoc(collection(db, 'recipes'), {
        name: recipeName,
        ingredients: ingredients.split('\n'),  // Assuming ingredients are separated by newlines
        instructions,
        imageUrl,
        createdAt: new Date(),
      });

      Alert.alert('Success', 'Recipe posted successfully!');
      setRecipeName('');
      setIngredients('');
      setInstructions('');
      setImageUrl('');
    } catch (error) {
      console.error('Error posting recipe: ', error);
      Alert.alert('Error', 'Failed to post recipe. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Post a New Recipe</Text>

      {/* Recipe Name */}
      <TextInput
        style={styles.input}
        placeholder="Recipe Name"
        value={recipeName}
        onChangeText={setRecipeName}
      />

      {/* Ingredients */}
      <TextInput
        style={styles.input}
        placeholder="Ingredients (separate by new line)"
        value={ingredients}
        onChangeText={setIngredients}
        multiline
      />

      {/* Instructions */}
      <TextInput
        style={styles.input}
        placeholder="Instructions"
        value={instructions}
        onChangeText={setInstructions}
        multiline
      />

      {/* Image URL */}
      <TextInput
        style={styles.input}
        placeholder="Image URL"
        value={imageUrl}
        onChangeText={setImageUrl}
      />

      {/* Post Recipe Button */}
      <Button title="Post Recipe" onPress={handlePostRecipe} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    width: '100%',
  },
});

export default PostRecipeScreen;
