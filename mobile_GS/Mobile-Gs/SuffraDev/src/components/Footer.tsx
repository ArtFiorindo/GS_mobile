import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';

const Footer = ({ navigation, style }: { navigation: any; style?: object }) => {
  return (
    <View style={[styles.footer, style]}>
      <TouchableOpacity onPress={() => navigation.navigate('AboutScreen')}>
        <Image
          source={require('../../assets/sinal-de-informacao.png')} // Substitua pelo caminho da sua imagem
          style={styles.icon}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('MedicoesScreen')}>
        <Image
          source={require('../../assets/history.png')} // Substitua pelo caminho da sua imagem
          style={styles.icon}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
        <Image
          source={require('../../assets/casa.png')} // Substitua pelo caminho da sua imagem
          style={styles.icon}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('AddMedicaoScreen')}>
        <Image
          source={require('../../assets/medidor.png')} // Substitua pelo caminho da sua imagem
          style={styles.icon}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('UserScreen')}>
        <Image
          source={require('../../assets/perfil.png')} // Substitua pelo caminho da sua imagem
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
    backgroundColor: '#ffe8d5', // Cor do fundo
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -3 },
    shadowRadius: 4,
    position: 'absolute',
    bottom: 0,
  },
  icon: {
    width: 30, // Largura da imagem
    height: 30, // Altura da imagem
    resizeMode: 'contain', // Ajusta o tamanho sem distorcer
  },
});

export default Footer;
