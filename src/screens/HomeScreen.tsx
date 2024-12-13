import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App'; // Import RootStackParamList
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

// Define the structure of a recipe posted in Firestore
interface FirestoreRecipe {
  recipeName: string;
  ingredients: string;
  image: string;
  uri?: string; // Firestore might not have uri
}

interface ApiRecipe {
  label: string;
  source: string;
  image: string;
  url: string;
  uri: string;
  ingredientLines: string[];
}

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>(); // Use the navigation type
  const [searchQuery, setSearchQuery] = useState('');
  const [recipes, setRecipes] = useState<(FirestoreRecipe | ApiRecipe)[]>([]);

  // Fetch recipes from Firestore
  const fetchRecipesFromFirestore = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'recipes'));
      const firestoreRecipes: FirestoreRecipe[] = querySnapshot.docs.map((doc) => {
        const data = doc.data() as FirestoreRecipe;
        return {
          recipeName: data.recipeName,
          ingredients: data.ingredients,
          image: data.image,
          uri: data.uri || '', // If no URI exists, set it to an empty string
        };
      });
      return firestoreRecipes;
    } catch (error) {
      console.error('Error fetching recipes from Firestore: ', error);
      return [];
    }
  };

  // Handle the search functionality
  const handleSearch = async () => {
    if (searchQuery.trim() === '') {
      return;
    }

    try {
      // Fetch recipes from Firestore and API simultaneously
      const firestoreRecipes = await fetchRecipesFromFirestore();

      // Fetch recipes from Edamam API
      const response = await fetch(
        `https://api.edamam.com/search?q=${searchQuery}&app_id=7047ebc9&app_key=b33cfbbbf820588a97cd22d8c9c1d3c1`
      );
      const data = await response.json();
      console.log(data);

      if (data.hits && data.hits.length > 0) {
        // Combine Firestore recipes with API search results
        const combinedRecipes = [
          ...firestoreRecipes,
          ...data.hits.map((hit: any) => hit.recipe),
        ];
        setRecipes(combinedRecipes);
      } else {
        setRecipes(firestoreRecipes); // If no API results, show only Firestore recipes
        alert('No recipes found. Please try a different search.');
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
      alert('An error occurred while fetching recipes.');
    }
  };

  useEffect(() => {
    // Initial fetch of recipes from Firestore when component mounts
    fetchRecipesFromFirestore().then(firestoreRecipes => {
      setRecipes(firestoreRecipes);
    });
  }, []); // Empty dependency array to run only once when component mounts

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to RecipeShare!</Text>

      <TextInput
        style={styles.input}
        placeholder="Search for a recipe..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <Button title="Search" onPress={handleSearch} />

      <Button title="Meal Planner" onPress={() => navigation.navigate('MealPlanner')} />

      <Button title="Shopping list" onPress={() => navigation.navigate('ShoppingList')} />

      <Button title="Post a Recipe" onPress={() => navigation.navigate('PostRecipe')} />

      {recipes.length === 0 && <Text>No recipes found. Please try again with another query.</Text>}

      <FlatList
        data={recipes}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.recipeItem}
            onPress={() => {
              // Handling for both Firestore and API recipes
              const recipeUri = 'uri' in item ? item.uri : 'url' in item ? item.url : ''; // Use 'uri' for Firestore recipes, 'url' for API
              const recipeName = 'recipeName' in item ? item.recipeName : item.label; // Use 'recipeName' for Firestore, 'label' for API

              console.log('Navigating to RecipeDetail with recipeName:', recipeName);
              console.log('Recipe Name:', recipeName);

              // Ensure recipeUri is a string before navigating
              if (!recipeUri || typeof recipeUri !== 'string') {
                console.error('Invalid recipeUri:', recipeUri);
                return;
              }

              // Navigate to the RecipeDetail screen with the recipeUri and recipeName
              navigation.navigate('RecipeDetail', {
                recipeUri: recipeUri, // Ensure recipeUri is passed as a string
                recipeName,
              });
            }}
          >
            <Text style={styles.recipeName}>{'recipeName' in item ? item.recipeName : item.label}</Text>
            <Text>{'source' in item ? item.source : ''}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.flatListContent}
      />
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
    marginBottom: 16,
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
  recipeItem: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#f4f4f4',
    borderRadius: 5,
  },
  recipeName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  flatListContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
});

export default HomeScreen;
