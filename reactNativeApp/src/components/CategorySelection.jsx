import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CategorySelection = ({ navigation }) => {

  // Function to handle category selection
  const handleCategoryPress = (category) => {
    // Here, you could navigate to the category-specific page
    // navigation.navigate('CategoryDetails', { category });
    alert(`You selected ${category}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select the type of information:</Text>

      <TouchableOpacity style={styles.button} onPress={() => handleCategoryPress('School')}>
        <Text style={styles.buttonText}>School</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => handleCategoryPress('Transport')}>
        <Text style={styles.buttonText}>Transport</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => handleCategoryPress('Housing')}>
        <Text style={styles.buttonText}>Housing</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => handleCategoryPress('New Laws')}>
        <Text style={styles.buttonText}>New Laws</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => handleCategoryPress('Upcoming Meetings')}>
        <Text style={styles.buttonText}>Upcoming Meetings</Text>
      </TouchableOpacity>
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
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default CategorySelection;
