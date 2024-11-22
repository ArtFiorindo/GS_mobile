import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';

const Footer = ({ navigation, style }: { navigation: any; style?: object }) => {
  return (
    <View style={[styles.footer, style]}>
      <TouchableOpacity onPress={() => navigation.navigate('AboutScreen')}>
        <Image
          source={require('../../assets/sinal-de-informacao.png')} 
          style={styles.icon}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('MedicoesScreen')}>
        <Image
          source={require('../../assets/history.png')} 
          style={styles.icon}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
        <Image
          source={require('../../assets/casa.png')} 
          style={styles.icon}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('AddMedicaoScreen')}>
        <Image
          source={require('../../assets/medidor.png')} 
          style={styles.icon}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('UserScreen')}>
        <Image
          source={require('../../assets/perfil.png')} 
          style={styles.icon}
        />
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
    backgroundColor: '#ffe8d5', 
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -3 },
    shadowRadius: 4,
    position: 'absolute', // Mantém o footer fixo na parte inferior da tela
    bottom: 0,
    zIndex: 10, // Garante que fique sobre outros elementos
  },
  icon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
});

export default Footer;
