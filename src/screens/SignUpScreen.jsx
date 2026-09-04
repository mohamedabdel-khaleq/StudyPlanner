import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';

import {
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';

const SignUpScreen = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = () => {
    // Check empty fields
    if (
      email.trim() === '' ||
      password.trim() === '' ||
      confirmPassword.trim() === ''
    ) {
      Alert.alert(
        'Error',
        'Please fill in all fields.'
      );
      return;
    }

    // Check password
    if (password !== confirmPassword) {
      Alert.alert(
        'Error',
        'Passwords do not match.'
      );
      return;
    }

    // Go to Login
    navigation.navigate('LoginScreen');
  };

  return (
    <View style={styles.container}>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        {/* Top Section */}
        <View style={styles.topBackground}>

          <Text style={styles.welcomeTitle}>
            Welcome
          </Text>

          <Text style={styles.welcomeSub}>
            It's time to be productive
          </Text>

        </View>

        {/* White Container */}
        <View style={styles.whiteContainer}>

          {/* Header */}
          <View style={styles.signupHeader}>

            <View style={styles.iconContainer}>
              <Text style={styles.iconText}>
                ⇥
              </Text>
            </View>

            <View style={styles.signupTextContainer}>

              <Text style={styles.sectionTitle}>
                Sign Up
              </Text>

              <Text style={styles.sectionSub}>
                Enter Your Credentials to continue
              </Text>

            </View>

          </View>

          {/* Line */}
          <View style={styles.line} />

          {/* Email */}
          <Text style={styles.label}>
            Email
          </Text>

          <View style={styles.inputWrapper}>

            <Text style={styles.inputIcon}>
              👤
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#777777"
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

          <View style={styles.inputWrapper}>

            <Text style={styles.inputIcon}>
              🔒
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#777777"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={true}
              autoCapitalize="none"
            />

          </View>

          {/* Confirm Password */}
          <Text style={styles.label}>
            Confirm Password
          </Text>

          <View style={styles.inputWrapper}>

            <Text style={styles.inputIcon}>
              🔒
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#777777"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={true}
              autoCapitalize="none"
            />

          </View>

          {/* Let's Start */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleSignUp}
            activeOpacity={0.8}
          >

            <Text style={styles.buttonText}>
              Let's Start
            </Text>

            <Text style={styles.arrow}>
              ➜
            </Text>

          </TouchableOpacity>

          {/* Login */}
          <View style={styles.loginBottom}>

            <Text style={styles.bottomText}>
              Already have an account?
            </Text>

            <TouchableOpacity
              onPress={() => navigation.navigate('LoginScreen')}
            >
              <Text style={styles.loginLink}>
                Log In
              </Text>
            </TouchableOpacity>

          </View>

        </View>

      </ScrollView>

    </View>
  );
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  scrollContent: {
    flexGrow: 1,
  },

  topBackground: {
    height: 260,
    backgroundColor: '#EDE4FF',

    justifyContent: 'center',
    alignItems: 'center',

    paddingBottom: 40,
  },

  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#151515',
    marginBottom: 5,
  },

  welcomeSub: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444444',
  },

  whiteContainer: {
    flex: 1,

    backgroundColor: '#FFFFFF',

    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,

    marginTop: -60,

    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 30,

    elevation: 10,
  },

  signupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },

  iconContainer: {
    width: 48,
    height: 48,

    borderRadius: 24,

    backgroundColor: '#B39AF5',

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 12,
  },

  iconText: {
    fontSize: 28,
    color: '#6600FF',
    fontWeight: 'bold',
  },

  signupTextContainer: {
    flex: 1,
  },

  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#151515',
    marginBottom: 2,
  },

  sectionSub: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555555',
  },

  line: {
    width: '100%',
    height: 2,

    backgroundColor: '#AFAFAF',

    marginBottom: 15,
  },

  label: {
    fontSize: 16,
    fontWeight: 'bold',

    color: '#222222',

    marginBottom: 7,
    marginLeft: 4,
    marginTop: 10,
  },

  inputWrapper: {
    width: '100%',
    height: 50,

    flexDirection: 'row',
    alignItems: 'center',

    borderWidth: 2,
    borderColor: '#A98BE8',

    borderRadius: 10,

    backgroundColor: '#D8CCF7',
  },

  inputIcon: {
    fontSize: 20,

    marginLeft: 14,
    marginRight: 8,
  },

  input: {
    flex: 1,

    height: 50,

    fontSize: 15,

    color: '#222222',

    paddingRight: 12,

    paddingLeft: 0,
  },

  button: {
    width: '100%',
    height: 55,

    backgroundColor: '#6331E8',

    borderRadius: 14,

    flexDirection: 'row',

    justifyContent: 'center',
    alignItems: 'center',

    marginTop: 28,

    elevation: 7,
  },

  buttonText: {
    color: '#FFFFFF',

    fontSize: 17,

    fontWeight: 'bold',

    marginRight: 10,
  },

  arrow: {
    color: '#FFFFFF',

    fontSize: 22,

    fontWeight: 'bold',
  },

  loginBottom: {
    flexDirection: 'row',

    justifyContent: 'center',
    alignItems: 'center',

    marginTop: 18,
  },

  bottomText: {
    fontSize: 13,

    color: '#666666',

    marginRight: 5,
  },

  loginLink: {
    fontSize: 13,

    color: '#6331E8',

    fontWeight: 'bold',
  },

});

export default SignUpScreen;

