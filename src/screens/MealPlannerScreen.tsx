import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';

interface Meal {
  id: string;
  name: string;
  day: string;
}

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const MealPlannerScreen: React.FC = () => {
  const [mealName, setMealName] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [mealPlan, setMealPlan] = useState<Meal[]>([]);

  const handleAddMeal = () => {
    if (!mealName || !selectedDay) {
      Alert.alert('Error', 'Please enter a meal name and select a day.');
      return;
    }

    const newMeal: Meal = {
      id: Math.random().toString(), // Unique ID for the meal
      name: mealName,
      day: selectedDay,
    };

    setMealPlan(prevMealPlan => [...prevMealPlan, newMeal]); // Update state
    setMealName('');
    setSelectedDay('');
  };

  const handleRemoveMeal = (id: string) => {
    setMealPlan(prevMealPlan => prevMealPlan.filter(meal => meal.id !== id)); // Remove meal by id
  };

  const mealsByDay = (day: string) => mealPlan.filter(meal => meal.day === day);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meal Planner</Text>

      {/* Input for adding meals */}
      <TextInput
        style={styles.input}
        placeholder="Enter meal name"
        value={mealName}
        onChangeText={setMealName}
      />

      {/* Day Selector */}
      <View style={styles.daysContainer}>
        {daysOfWeek.map(day => (
          <TouchableOpacity
            key={day}
            style={[
              styles.dayButton,
              selectedDay === day ? styles.selectedDay : null,
            ]}
            onPress={() => setSelectedDay(day)}
          >
            <Text style={styles.dayButtonText}>{day}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Button title="Add Meal" onPress={handleAddMeal} />

      {/* Meal List */}
      <FlatList
        data={daysOfWeek}
        keyExtractor={(item) => item} // Unique key for day
        renderItem={({ item: day }) => (
          <View style={styles.daySection}>
            <Text style={styles.dayTitle}>{day}</Text>
            {mealsByDay(day).length === 0 ? (
              <Text style={styles.noMealsText}>No meals planned</Text>
            ) : (
              mealsByDay(day).map(meal => (
                <View key={meal.id} style={styles.mealItem}>
                  <Text style={styles.mealName}>{meal.name}</Text>
                  <Button
                    title="Remove"
                    color="red"
                    onPress={() => handleRemoveMeal(meal.id)}
                  />
                </View>
              ))
            )}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 4,
    marginBottom: 16,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dayButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
    width: '30%',
    alignItems: 'center',
  },
  selectedDay: {
    backgroundColor: '#4CAF50',
  },
  dayButtonText: {
    color: '#000',
  },
  daySection: {
    marginBottom: 16,
  },
  dayTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  noMealsText: {
    fontStyle: 'italic',
    color: '#999',
  },
  mealItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 4,
    marginBottom: 8,
  },
  mealName: {
    fontSize: 16,
  },
});

export default MealPlannerScreen;
