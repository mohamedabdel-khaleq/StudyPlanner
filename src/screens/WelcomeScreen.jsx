import React from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
} from 'react-native';

const WelcomeScreen = ({ navigation }) => {
  const handleGetStarted = () => {
    navigation.navigate('SignUpScreen');
  };

  return (
    <View style={styles.container}>

      <Image
        source={require('../../assets/images/welcome.png')}
        style={styles.image}
        resizeMode="contain"
      />

      <View style={styles.content}>

        <Text style={styles.title}>
          Task Management &{'\n'}To-Do List
        </Text>

        <Text style={styles.description}>
          This productive tool is designed to help{'\n'}
          you better manage your task{'\n'}
          project-wise conveniently!
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleGetStarted}
        >
          <Text style={styles.buttonText}>
            Let's Start
          </Text>

          <Text style={styles.arrow}>
            ➜
          </Text>
        </Pressable>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingHorizontal: 25,
  },

  image: {
    width: 260,
    height: 300,
    marginTop: 35,
    alignSelf: 'center',
  },

  content: {
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#222222',
    textAlign: 'center',
    lineHeight: 30,
  },

  description: {
    marginTop: 18,
    fontSize: 14,
    color: '#777777',
    textAlign: 'center',
    lineHeight: 21,
  },

  button: {
    width: '90%',
    height: 55,
    backgroundColor: '#5B2DE8',
    borderRadius: 12,
    marginTop: 30,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    elevation: 5,
  },

  buttonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  arrow: {
    color: '#FFFFFF',
    fontSize: 20,
    marginLeft: 15,
  },

});

export default WelcomeScreen;