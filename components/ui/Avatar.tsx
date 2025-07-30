import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface AvatarProps {
  source?: string;
  name?: string;
  size?: number;
  style?: any;
}

export const Avatar: React.FC<AvatarProps> = ({
  source,
  name = '',
  size = 40,
  style,
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
        <View style={[styles.placeholder, { width: size, height: size }]}>
          <Text style={[styles.initials, { fontSize: size * 0.4 }]}>
            {getInitials(name)}
          </Text>
        </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 50,
    overflow: 'hidden',
  },
  image: {
    borderRadius: 50,
  },
  placeholder: {
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  initials: {
    color: '#fff',
    fontWeight: '600',
  },
});