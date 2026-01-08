import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../styles/screens/HomeStyles';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Home</Text>
        <Text style={styles.subtitle}>Welcome back 👋</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardText}>This is a dashboard card</Text>
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;
