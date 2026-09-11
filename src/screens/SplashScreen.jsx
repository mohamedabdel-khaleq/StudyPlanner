import React, { useEffect } from 'react';
import {
  Image,
  StyleSheet,
  View,
} from 'react-native';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('WelcomeScreen');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>

      <Image
        source={require('../../assets/images/Mask group.png')}
        style={styles.image}
        resizeMode="contain"
      />

    </View>
  );
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  image: {
    width: '65%',
    height: '45%',
  },

});

export default SplashScreen;