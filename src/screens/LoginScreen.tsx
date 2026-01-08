import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { LoginStyles } from '../styles/screens/LoginStyles';

interface LoginScreenProps {
  navigation: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // FIXED: Changed from 'Dashboard' to 'Main'
      navigation.replace('Main');
    }, 1500);
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={LoginStyles.container}
    >
      <View style={LoginStyles.formContainer}>
        <Text style={LoginStyles.title}>Welcome Back</Text>
        <Text style={LoginStyles.subtitle}>Sign in to continue</Text>

        <View style={LoginStyles.inputContainer}>
          <TextInput
            style={LoginStyles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={LoginStyles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={LoginStyles.forgotPasswordButton}
          onPress={handleForgotPassword}
        >
          <Text style={LoginStyles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[LoginStyles.loginButton, loading && LoginStyles.loginButtonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={LoginStyles.loginButtonText}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Text>
        </TouchableOpacity>

        <View style={LoginStyles.signupContainer}>
          <Text style={LoginStyles.signupText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={LoginStyles.signupLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;