import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Footer from '../components/Footer';

const AboutScreen = ({ navigation }: { navigation: any }) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require('../../assets/Suffra.png')} style={styles.logoImage} />
        <Text style={styles.headerTitle}>Sobre</Text>
      </View>

      {/* Content Section */}
      <View style={styles.contentContainer}>
        <View style={styles.card}>
          <Text style={styles.paragraph}>
            Você sabe quanta energia sua torre consome? Para incentivar um consumo mais consciente e sustentável,
            estamos acompanhando o gasto energético de cada torre do condomínio. A torre que registrar o menor consumo
            será premiada, mostrando que pequenas mudanças podem fazer uma grande diferença! Vamos juntos economizar
            energia, reduzir custos e cuidar do planeta. Fique de olho nas atualizações e participe desse desafio pela
            sustentabilidade!
          </Text>
        </View>
      </View>

      {/* Footer */}
      <Footer navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // Fundo branco geral
  },
  header: {
    marginTop: 20,
    alignItems: 'center',
  },
  logoImage: {
    width: 130,
    height: 130,
    resizeMode: 'contain',
    marginTop: -40,
    top: 10, // Ajustar a margem superior
    left: -130, // Ajustar a margem à esquerda
  },
  headerTitle: {
    fontSize: 32,
    color: '#000000',
    marginTop: 50,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  card: {
    backgroundColor: '#ffcca2', // Fundo do card
    borderRadius: 15,
    padding: 20,
    width: '95%',
    height: '60%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3, // Sombra para Android
    marginBottom: 200
  },
  paragraph: {
    fontSize: 20,
    color: '#000000',
    textAlign: 'justify',
    lineHeight: 24,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
});

export default AboutScreen;
