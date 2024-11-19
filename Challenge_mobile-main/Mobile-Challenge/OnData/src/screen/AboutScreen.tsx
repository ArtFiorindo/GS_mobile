import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Footer from '../components/Footer';

const AboutScreen = ({ navigation }: { navigation: any }) => {
  return (
    <LinearGradient colors={['#000000', '#000000']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require('../../assets/image.png')} style={styles.logoImage} />
        <Text style={styles.headerTitle}>Sobre</Text>
      </View>

      {/* Content Section */}
      <View style={styles.content}>
        <Text style={styles.paragraph}>
          Você sabe quanta energia sua torre consome? Para incentivar um consumo mais consciente e sustentável,
          estamos acompanhando o gasto energético de cada torre do condomínio. A torre que registrar o menor consumo
          será premiada, mostrando que pequenas mudanças podem fazer uma grande diferença! Vamos juntos economizar
          energia, reduzir custos e cuidar do planeta. Fique de olho nas atualizações e participe desse desafio pela
          sustentabilidade!
        </Text>
      </View>

      {/* Footer */}
      <Footer navigation={navigation} />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 40,
  },
  header: {
    marginTop: 20,
    alignItems: 'center',
  },
  logoText: {
    fontSize: 24,
    color: '#D1C187',
    fontWeight: 'bold',
  },
   logoImage: {
    width: 140, // Tamanho da imagem
    height: 140,
    resizeMode: 'contain',
    marginTop: -60, // Move apenas a imagem para cima
  },
  headerTitle: {
    fontSize: 32,
    color: '#FFFFFF',
    marginTop: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  paragraph: {
    fontFamily: 'monospace',
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingBottom: 20,
    backgroundColor: '#000000',
  },
});

export default AboutScreen;
