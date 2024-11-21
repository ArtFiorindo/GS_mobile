import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Footer from '../components/Footer';

const FullCircle = ({ color, percentage }: { color: string; percentage: number }) => {
  const radius = 40;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <Svg width={100} height={100} viewBox="0 0 100 100">
      <Circle cx="50" cy="50" r={radius} fill="none" stroke="#E0E0E0" strokeWidth={strokeWidth} />
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
        transform="rotate(-90 50 50)"
      />
    </Svg>
  );
};

const HomeScreen = ({ navigation }: { navigation: any }) => {
  const [torreData, setTorreData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL_MEDICOES = 'http://localhost:3000/api/medicoes';

  const fetchMedicoes = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Erro', 'Token não encontrado. Faça login novamente.');
        navigation.replace('LoginScreen');
        return;
      }

      const response = await fetch(API_URL_MEDICOES, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        processTorreData(data);
      } else {
        Alert.alert('Erro', data.error || 'Erro ao buscar as medições.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  const processTorreData = (data: any[]) => {
    const torreSums = data.reduce((acc, item) => {
      acc[item.torre] = (acc[item.torre] || 0) + item.kwh;
      return acc;
    }, {});

    const totalKwh = Object.values(torreSums).reduce((sum, value) => sum + value, 0);

    const processedData = Object.entries(torreSums)
      .map(([torre, kwh]) => ({
        torre,
        kwh,
        percentage: ((kwh / totalKwh) * 100).toFixed(1),
      }))
      .sort((a, b) => a.kwh - b.kwh);

    setTorreData(processedData);
  };

  useFocusEffect(
    useCallback(() => {
      fetchMedicoes();
    }, [])
  );

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#000000" />
      </View>
    );
  }

  return (
    <LinearGradient colors={['#ffffff', '#ffffff']} style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../../assets/Suffra.png')} style={styles.logoImage} />
        <Text style={styles.headerTitle}>Home</Text>
      </View>

      {/* Adicionando o elemento de fundo atrás dos cartões */}
      <View style={styles.backgroundElement} />

      <View style={styles.cardContainer}>
        {torreData.map(({ torre, kwh, percentage }, index) => (
          <View key={index} style={styles.card}>
            <View>
              <Text style={styles.cardTitle}>{torre}</Text>
              <Text style={styles.cardPercentage}>
                {percentage}% dos gastos gerais ({kwh.toFixed(2)} kWh)
              </Text>
            </View>
            <FullCircle
              color={['#8EEA8A', '#F8D23B', '#F87272'][index]} // Verde, Amarelo, Vermelho por ordem
              percentage={parseFloat(percentage)}
            />
          </View>
        ))}
      </View>

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
    backgroundColor: '#ffe8d5',
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
    top: -30, // Ajustar a margem superior
    left: -130, // Ajustar a margem à esquerda
  },
  headerTitle: {
    fontSize: 32,
    color: '#000000',
    marginTop: 10,
    fontWeight: 'bold',
  },
  
  backgroundElement: {
    position: 'absolute',
    top: '25%',
    width: '100%',
    height: '70%',
    backgroundColor: '#ffcca2', // Cor de fundo atrás dos cartões
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  card: {
    backgroundColor: '#ffe8d5',
    width: '80%',
    height: '20%',
    padding: 20,
    marginVertical: 10,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
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
});

export default HomeScreen;
