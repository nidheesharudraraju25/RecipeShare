import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import MealPlannerScreen from './src/screens/MealPlannerScreen'; // Path to your Meal Planner screen
import ShoppingListScreen from './src/screens/ShoppingListScreen'; // Path to your Shopping List screen
import RecipeDetailScreen from './src/screens/RecipeDetailScreen';  // Import RecipeDetail screen
import PostRecipeScreen from './src/screens/PostRecipeScreen';  // Import the new screen




// Define the type for the navigation stack
export type RootStackParamList = {
  Home: undefined; // No parameters for Home
  Login: undefined; // No parameters for Login
  Register: undefined;
  MealPlanner: undefined;
  ShoppingList: undefined;
  PostRecipe: undefined;
  RecipeDetail: {  recipeUri: string; recipeName: string }; 
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login to RecipeShare' }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Register for RecipeShare' }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Welcome to RecipeShare' }} />
        <Stack.Screen name="MealPlanner"component={MealPlannerScreen} options={{ title: 'Meal Planner' }}/>
        <Stack.Screen name="ShoppingList"component={ShoppingListScreen} options={{ title: 'Shopping List' }}/>
        <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
        <Stack.Screen name="PostRecipe" component={PostRecipeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
