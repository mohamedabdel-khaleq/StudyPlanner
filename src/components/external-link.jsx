import React from 'react';
import { Pressable, Linking } from 'react-native';

const ExternalLink = ({ href, children, ...rest }) => {
  const handlePress = async () => {
    try {
      await Linking.openURL(href);
    } catch (error) {
      console.log('Could not open link:', error);
    }
  };

  return (
    <Pressable
      {...rest}
      onPress={handlePress}
    >
      {children}
    </Pressable>
  );
};

export default ExternalLink;