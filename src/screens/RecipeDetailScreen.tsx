import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Image } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import { db } from '../config/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore'; // To fetch a specific document from Firestore

// Define the structure of a recipe from the Edamam API and Firestore
type Recipe = {
  uri: string;
  label: string;
  image: string;
  source: string;
  url: string;
  ingredientLines: string[];
  recipeName?: string; // Optional property for Firestore data
  ingredients?: string; // Optional property for Firestore data
};

type RecipeDetailScreenProps = {
  route: RouteProp<RootStackParamList, 'RecipeDetail'>;
};

// CORS proxy to bypass CORS issues for development only
const corsProxyUrl = "https://cors-anywhere.herokuapp.com/";

const RecipeDetailScreen: React.FC<RecipeDetailScreenProps> = ({ route }) => {
  const { recipeUri, recipeName } = route.params; // Destructure recipeUri and recipeName from route.params
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [firestoreRecipe, setFirestoreRecipe] = useState<Recipe | null>(null);

  // Function to extract recipe ID from the recipe URI (after the #)
  const extractRecipeId = (uri: string): string => {
    const matches = uri.match(/#recipe_(.*)/);
    return matches ? matches[1] : ''; // Extract ID from the URI (after #recipe_)
  };

  const recipeId = extractRecipeId(recipeUri); // Extract recipe ID from the URI

  // Function to check if the recipeUri is a valid URL
  function isValidUrl(url: string): boolean {
    const pattern = /^(https?:\/\/[^\s$.?#].[^\s]*)$/;
    return pattern.test(url); // Check if it matches the URL format
  }

  // Check if recipeUri is valid before making the fetch call
  if (!isValidUrl(recipeUri)) {
    console.error('Invalid recipeUri format:', recipeUri); // Log if it's an invalid URL
    return <Text>Error: Invalid Recipe URL</Text>;
  }

  // Fetch recipe from Firestore
  const fetchRecipeFromFirestore = async (id: string) => {
    try {
      const docRef = doc(db, 'recipes', id); // Fetch the document by ID
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setFirestoreRecipe({
          recipeName: data.name || recipeName,  // Use recipeName from Firestore or fallback to route params
          ingredients: data.ingredients || '',
          image: data.imageUrl || '',
          uri: recipeUri,
          url: data.url || '',
          ingredientLines: data.ingredients ? data.ingredients.split(',') : [],
          label: data.name || 'No label', // Provide a default value for label
          source: data.source || 'Unknown', // Provide a default value for source
        });
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error('Error fetching recipe from Firestore:', error);
    }
  };

  useEffect(() => {
    async function fetchRecipe() {
      try {
        if (!recipeId) {
          console.error('Invalid recipeId');
          setLoading(false);
          return;
        }

        // Fetch Firestore recipe
        fetchRecipeFromFirestore(recipeId);

        // Fetch recipe from Edamam API
        const apiUrl = `https://api.edamam.com/api/recipes/v2/${recipeId}?app_id=7047ebc9&app_key=b33cfbbbf820588a97cd22d8c9c1d3c1`;

        // Prefix the API URL with the CORS proxy URL for development
        const response = await fetch(corsProxyUrl + apiUrl);
        const data = await response.json();

        if (data.hits && data.hits.length > 0) {
          setRecipe(data.hits[0].recipe); // Assuming the first hit contains the recipe details
        } else {
          console.error('No recipe found for the given recipeId');
        }
      } catch (error) {
        console.error('Error fetching recipe:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRecipe();
  }, [recipeId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  // Merge Firestore and API data (if both are available)
  const finalRecipe = recipe || firestoreRecipe;

  if (!finalRecipe) {
    return (
      <View style={styles.container}>
        <Text>Error: Recipe not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{finalRecipe.recipeName}</Text>
      <Image source={{ uri: finalRecipe.image }} style={styles.image} />
      <Text>Source: {finalRecipe.source}</Text>
      <Text>URL: {finalRecipe.url}</Text>
      <Text>Ingredients:</Text>
      {finalRecipe.ingredientLines.map((ingredient, index) => (
        <Text key={index}>- {ingredient}</Text>
      ))}
    </ScrollView>
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
  image: {
    width: '100%',
    height: 200,
    marginBottom: 16,
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 20,
  },
});

export default RecipeDetailScreen;
