import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Footer = ({ navigation, style }: { navigation: any; style?: object }) => {
  return (
    <View style={[styles.footer, style]}>
      <TouchableOpacity onPress={() => navigation.navigate('AboutScreen')}>
        <Ionicons name="information-circle-outline" size={40} color="#000000" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('MedicoesScreen')}>
        <Ionicons name="time-outline" size={40} color="#000000" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
        <Ionicons name="home-outline" size={40} color="#000000" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('AddMedicaoScreen')}>
        <Ionicons name="speedometer-outline" size={40} color="#000000" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('UserScreen')}>
        <Ionicons name="person-outline" size={40} color="#000000" />
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
    height: 55,
    backgroundColor: '#ffe8d5', // Alterado para a cor solicitada
    borderTopWidth: 1, // Adicionado um contorno sutil para destaque
    borderTopColor: '#ccc', // Cinza claro para o contorno
    shadowColor: '#000', // Sombra sutil
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -3 },
    shadowRadius: 4,
    position: 'absolute', // Posiciona o footer
    bottom: 0, // Fixado na parte inferior
  },
});

export default Footer;
