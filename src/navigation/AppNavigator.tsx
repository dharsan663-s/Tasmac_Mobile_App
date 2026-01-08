// AppNavigator.tsx - REMOVE NavigationContainer from here
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Import screens
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ScanScreen from '../screens/ScanScreen';
import ValidScanScreen from '../screens/ValidScanScreen';
import InvalidScanScreen from '../screens/InvalidScanScreen';
import ScanLogScreen from '../screens/ScanLogScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'dashboard' : 'dashboard';
          } else if (route.name === 'Scan') {
            iconName = focused ? 'qr-code-scanner' : 'qr-code-scanner';
          } else if (route.name === 'ScanLog') {
            iconName = focused ? 'history' : 'history';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Icon name={iconName as string} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={HomeScreen} />
      <Tab.Screen name="Scan" component={ScanScreen} />
      <Tab.Screen name="ScanLog" component={ScanLogScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  return (
    // REMOVE NavigationContainer from here
    <Stack.Navigator initialRouteName="Login">
      {/* Auth Screens */}
      <Stack.Screen 
        name="Login" 
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Signup" 
        component={SignupScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="ForgotPassword" 
        component={ForgotPasswordScreen}
        options={{ title: 'Reset Password' }}
      />
      
      {/* Main App */}
      <Stack.Screen 
        name="Main" 
        component={MainTabs}
        options={{ headerShown: false }}
      />
      
      {/* Scan Result Screens */}
      <Stack.Screen 
        name="ValidScan" 
        component={ValidScanScreen}
        options={{ title: 'Valid Scan' }}
      />
      <Stack.Screen 
        name="InvalidScan" 
        component={InvalidScanScreen}
        options={{ title: 'Invalid Scan' }}
      />
      
      {/* Other Screens */}
      <Stack.Screen 
        name="ScanDetail" 
        component={ScanLogScreen}
        options={{ title: 'Scan Details' }}
      />
    </Stack.Navigator>
  );
}

export default AppNavigator;