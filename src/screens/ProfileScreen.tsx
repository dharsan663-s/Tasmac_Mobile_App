import React from 'react';
import { View, Text } from 'react-native';
import styles from '../styles/screens/ProfileStyles';

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>Profile</Text>
    </View>
  );
};

export default ProfileScreen;
