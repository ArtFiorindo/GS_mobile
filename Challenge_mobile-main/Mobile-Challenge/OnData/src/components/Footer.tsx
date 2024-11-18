import React from 'react';
import { View, Text } from 'react-native';

const Footer: React.FC = () => {
  return (
    <View style={{ height: 50, backgroundColor: '#8C82FC', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: 'white' }}>© 2024 Todos direitos reservados OnData</Text>
    </View>
  );
};

export default Footer;
