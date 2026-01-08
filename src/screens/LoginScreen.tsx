import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../styles/screens/LoginStyles';

const LoginScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Text style={styles.link}>Go to Home</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.link}>Go to Signup</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
