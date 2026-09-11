import React, { useState } from 'react';
import {
  Alert,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const handleLogin = async () => {
    if (email.trim() === '' || password.trim() === '') {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    try {
      const data = await login(email.trim(), password);

      console.log('Login successful:', data);

      navigation.navigate('HomeScreen');
    } catch (error) {
      console.log('Login error:', error);

      Alert.alert(
        'Login Failed',
        error.message || 'Invalid email or password'
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        {/* Title */}
        <View style={styles.titleContainer}>

          <Text style={styles.title}>
            Welcome Back
          </Text>

          <Text style={styles.subtitle}>
            It's time to be productive
          </Text>

        </View>

        {/* Login Card */}
        <View style={styles.loginCard}>

          {/* Header */}
          <View style={styles.cardHeader}>

            <View style={styles.loginIcon}>

              <Ionicons
                name="log-in-outline"
                size={24}
                color="#6633E8"
              />

            </View>

            <View style={styles.headerTextContainer}>

              <Text style={styles.cardTitle}>
                Log In
              </Text>

              <Text style={styles.cardSubtitle}>
                Enter Your Credentials to continue
              </Text>

            </View>

          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Email */}
          <Text style={styles.label}>
            Email
          </Text>

          <View style={styles.inputContainer}>

            <Ionicons
              name="person-outline"
              size={19}
              color="#5E4B8B"
              style={styles.inputIcon}
            />

            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#A99BCF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

          </View>

          {/* Password */}
          <Text style={styles.label}>
            Password
          </Text>

          <View style={styles.inputContainer}>

            <Ionicons
              name="lock-closed-outline"
              size={19}
              color="#5E4B8B"
              style={styles.inputIcon}
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#A99BCF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
            />

            {/* Eye Button */}
            <Pressable
              style={styles.eyeButton}
              onPress={() =>
                setShowPassword((prev) => !prev)
              }
            >

              <Ionicons
                name={
                  showPassword
                    ? 'eye-off-outline'
                    : 'eye-outline'
                }
                size={20}
                color="#5E4B8B"
              />

            </Pressable>

          </View>

          {/* Login Button */}
          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleLogin}
          >

            <Text style={styles.buttonText}>
              Let's Start
            </Text>

            <Ionicons
              name="arrow-forward-outline"
              size={22}
              color="#FFFFFF"
              style={styles.arrowIcon}
            />
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 40,
  },

  titleContainer: {
    alignItems: 'center',
    marginBottom: 42,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#151515',
  },

  subtitle: {
    fontSize: 13,
    color: '#555555',
    marginTop: 4,
  },

  loginCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    paddingHorizontal: 22,
    paddingVertical: 25,

    elevation: 4,

    shadowOffset: {
      width: 0,
      height: 4,
    },

    shadowOpacity: 0.08,
    shadowRadius: 12,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  loginIcon: {
    width: 43,
    height: 43,
    borderRadius: 22,

    backgroundColor: '#E9DDFF',

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 12,
  },

  headerTextContainer: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#222222',
  },

  cardSubtitle: {
    fontSize: 10,
    color: '#777777',
    marginTop: 2,
  },

  divider: {
    height: 1,
    backgroundColor: '#D7D7D7',

    marginTop: 22,
    marginBottom: 24,
  },

  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#222222',

    marginBottom: 8,
  },

  inputContainer: {
    height: 48,

    backgroundColor: '#DCCEFF',

    borderRadius: 9,

    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 12,

    marginBottom: 18,
  },

  inputIcon: {
    marginRight: 8,
  },

  input: {
    flex: 1,

    height: '100%',

    fontSize: 13,

    color: '#333333',
  },

  eyeButton: {
    width: 40,
    height: 46,

    justifyContent: 'center',
    alignItems: 'center',
  },

  button: {
    height: 53,

    backgroundColor: '#5B2DE8',

    borderRadius: 11,

    marginTop: 22,

    flexDirection: 'row',

    justifyContent: 'center',
    alignItems: 'center',

    elevation: 4,
  },

  buttonPressed: {
    opacity: 0.75,

    transform: [
      {
        scale: 0.98,
      },
    ],
  },

  buttonText: {
    color: '#FFFFFF',

    fontSize: 15,

    fontWeight: '800',
  },

  arrowIcon: {
    marginLeft: 15,
  },

});

export default LoginScreen;