import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';

const FullCircle = ({ color, percentage }: { color: string; percentage: number }) => {
  const radius = 40; // Raio do círculo
  const strokeWidth = 10; // Largura do traço
  const circumference = 2 * Math.PI * radius; // Comprimento total do círculo
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <Svg width={100} height={100} viewBox="0 0 100 100">
      {/* Fundo do círculo */}
      <Circle
        cx="50"
        cy="50"
        r={radius}
        fill="none"
        stroke="#E0E0E0"
        strokeWidth={strokeWidth}
      />
      {/* Círculo proporcional ao percentual */}
      <Circle
        cx="50"
        cy="50"
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        transform="rotate(-90 50 50)" // Rota para começar do topo
      />
    </Svg>
  );
};

const HomeScreen = ({ navigation }: { navigation: any }) => {
  return (
    <LinearGradient colors={['#000000', '#000000']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logoText}>⚡ Clean Energy</Text>
        <Text style={styles.headerTitle}>Home</Text>
      </View>

      {/* Cards Section */}
      <View style={styles.cardContainer}>
        {/* Card 1 */}
        <View style={styles.card}>
          <View>
            <Text style={styles.cardTitle}>Torre A</Text>
            <Text style={styles.cardPercentage}>15% Dos gastos gerais</Text>
          </View>
          <FullCircle color="#8EEA8A" percentage={15} />
        </View>
        {/* Card 2 */}
        <View style={styles.card}>
          <View>
            <Text style={styles.cardTitle}>Torre B</Text>
            <Text style={styles.cardPercentage}>30% Dos gastos gerais</Text>
          </View>
          <FullCircle color="#F8D23B" percentage={30} />
        </View>
        {/* Card 3 */}
        <View style={styles.card}>
          <View>
            <Text style={styles.cardTitle}>Torre C</Text>
            <Text style={styles.cardPercentage}>45% Dos gastos gerais</Text>
          </View>
          <FullCircle color="#F87272" percentage={45} />
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate('AboutScreen')}>
          <Ionicons name="information-circle-outline" size={40} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
          <Ionicons name="home-outline" size={40} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('UserScreen')}>
          <Ionicons name="person-outline" size={40} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
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
  headerTitle: {
    fontSize: 32,
    color: '#FFFFFF',
    marginTop: 10,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  card: {
    backgroundColor: '#FFFFFF',
    width: '80%',
    height: '15%',
    padding: 20,
    marginVertical: 10,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  cardPercentage: {
    fontSize: 14,
    color: '#555555',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingBottom: 20,
    backgroundColor: '#000000',
  },
});

export default HomeScreen;
