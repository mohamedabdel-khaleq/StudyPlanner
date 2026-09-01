import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
  Alert,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import styles from './styles';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    Alert.alert('Success', 'Logged in successfully!');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* Gradient Background Section */}
        <LinearGradient
          colors={['#FFF9E6', '#E6F3FF', '#F0E6FF', '#FFE6F0']}
          locations={[0, 0.33, 0.66, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientContainer}
        >
          {/* Welcome Section */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>Welcome Back</Text>
            <Text style={styles.welcomeSub}>It's time to be productive</Text>
          </View>
        </LinearGradient>

        {/* White Container with Rounded Top */}
        <View style={styles.whiteContainer}>
          {/* Login Header with Icon */}
          <View style={styles.loginHeader}>
            <View style={styles.iconContainer}>
              <MaterialIcons name="login" size={24} color="#6600FF" />
            </View>
            <View style={styles.loginTextContainer}>
              <Text style={styles.sectionTitle}>Log In</Text>
              <Text style={styles.sectionSub}>Enter Your Credentials to continue</Text>
            </View>
          </View>

          <View style={styles.line} />

          {/* Email Input */}
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons 
                name="person" 
                size={25} 
                color="#969696"  
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Email Address"
                placeholderTextColor="#AF93FF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

          {/* Password Input */}
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrapper}>
              <MaterialIcons 
                name="lock" 
                size={25} 
                color="#969696" 
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#AF93FF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

          {/* Login Button */}
          <TouchableOpacity style={styles.button} onPress={handleLogin} activeOpacity={0.8}>
            <Text style={styles.buttonText}>Let's Start</Text>
            <MaterialIcons name="arrow-forward" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;