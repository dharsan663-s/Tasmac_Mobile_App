// AppNavigator.tsx
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

function ScanTabStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Scan" component={ScanScreen} />
      <Stack.Screen 
        name="ValidScan" 
        component={ValidScanScreen}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen 
        name="InvalidScan" 
        component={InvalidScanScreen}
        options={{ presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
}

function ScanLogTabStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ScanLog" component={ScanLogScreen} />
    </Stack.Navigator>
  );
}

function ProfileTabStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}

function HomeTabStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'HomeTab') {
            iconName = focused ? 'dashboard' : 'dashboard';
          } else if (route.name === 'ScanTab') {
            iconName = focused ? 'qr-code-scanner' : 'qr-code-scanner';
          } else if (route.name === 'ScanLogTab') {
            iconName = focused ? 'history' : 'history';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Icon name={iconName as string} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeTabStack}
        options={{ title: 'Home' }}
      />
      <Tab.Screen 
        name="ScanTab" 
        component={ScanTabStack}
        options={{ title: 'Scan' }}
      />
      <Tab.Screen 
        name="ScanLogTab" 
        component={ScanLogTabStack}
        options={{ title: 'Scan Log' }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileTabStack}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

function AppNavigator() {
  return (
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
      
      {/* Main App Tabs */}
      <Stack.Screen 
        name="Main" 
        component={MainTabs}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default AppNavigator;