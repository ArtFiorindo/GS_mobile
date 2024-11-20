import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Footer = ({ navigation, style }: { navigation: any; style?: object }) => {
  return (
    <View style={[styles.footer, style]}>
      <TouchableOpacity onPress={() => navigation.navigate('AboutScreen')}>
        <Ionicons name="information-circle-outline" size={40} color="#FFFFFF" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('MedicoesScreen')}>
        <Ionicons name="time-outline" size={40} color="#FFFFFF" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
        <Ionicons name="home-outline" size={40} color="#FFFFFF" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('AddMedicaoScreen')}>
        <Ionicons name="speedometer-outline" size={40} color="#FFFFFF" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('UserScreen')}>
        <Ionicons name="person-outline" size={40} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    height: 80,
    backgroundColor: '#000000',
  },
});

export default Footer;
