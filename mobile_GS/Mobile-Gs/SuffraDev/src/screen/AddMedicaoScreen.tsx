import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Image, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Footer from '../components/Footer';
import { Picker } from '@react-native-picker/picker';

const AddMedicaoScreen = ({ navigation }: { navigation: any }) => {
  const [username, setUsername] = useState('');
  const [torre, setTorre] = useState('');
  const [kwh, setKwh] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddMedicao = async () => {
    try {
      if (!username || !torre || !kwh) {
        Alert.alert('Erro', 'Todos os campos são obrigatórios.');
        return;
      }

      if (isNaN(parseFloat(kwh)) || parseFloat(kwh) <= 0) {
        Alert.alert('Erro', 'O campo kWh deve ser um número válido e maior que 0.');
        return;
      }

      setIsLoading(true);

      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Erro', 'Token não encontrado. Faça login novamente.');
        navigation.replace('LoginScreen');
        return;
      }

      const response = await fetch('http://localhost:3000/api/verify-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert('Erro', data.error || 'Usuário não encontrado. Verifique e tente novamente.');
        return;
      }

      const userId = data.userId;

      const medicaoResponse = await fetch('http://localhost:3000/api/medicoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_id: userId,
          torre,
          kwh,
        }),
      });

      const medicaoData = await medicaoResponse.json();

      if (medicaoResponse.ok) {
        Alert.alert('Sucesso', 'Medição adicionada com sucesso!');
        setUsername('');
        setTorre('');
        setKwh('');
      } else {
        Alert.alert('Erro', medicaoData.error || 'Erro ao adicionar a medição.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível conectar ao servidor. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  return (
    <LinearGradient colors={['#ffffff', '#ffffff']} style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../../assets/Suffra.png')} style={styles.logoImage} />
        <Text style={styles.headerTitle}>Adicionar Medição</Text>
      </View>

      <View style={styles.backgroundElement} />

      <View style={styles.card}>
        <View style={styles.inputRow}>
          <Ionicons name="person-outline" size={24} color="#000" style={styles.icon} />
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Digite o username"
              placeholderTextColor="#888"
            />
          </View>
        </View>

        <View style={styles.inputRow}>
          <Ionicons name="business-outline" size={24} color="#000" style={styles.icon} />
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Escolha a Torre</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={torre}
                onValueChange={(itemValue) => setTorre(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Selecione a Torre" value="" />
                <Picker.Item label="Torre A" value="Torre A" />
                <Picker.Item label="Torre B" value="Torre B" />
                <Picker.Item label="Torre C" value="Torre C" />
              </Picker>
            </View>
          </View>
        </View>

        <View style={styles.inputRow}>
          <Ionicons name="speedometer-outline" size={24} color="#000" style={styles.icon} />
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Gasto em Kwh</Text>
            <TextInput
              style={styles.input}
              value={kwh}
              onChangeText={setKwh}
              placeholder="Digite o gasto em Kwh"
              keyboardType="numeric"
              placeholderTextColor="#888"
            />
          </View>
        </View>

        <TouchableOpacity style={styles.addButton} onPress={handleAddMedicao}>
          <Text style={styles.buttonText}>Adicionar</Text>
        </TouchableOpacity>
      </View>
      

      <Footer navigation={navigation} />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center', // Centraliza horizontalmente
    backgroundColor: '#ffe8d5',
    justifyContent: 'flex-start', // Alinha todo o conteúdo no topo
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    width: '100%',
  },
  logoImage: {
    width: 130,
    height: 130,
    resizeMode: 'contain',
    marginTop: -40,
    top: 30, // Ajustar a margem superior
    left: -130, // Ajustar a margem à esquerda
  },
  backgroundElement: {
    position: 'absolute',
    top: '25%',
    width: '100%',
    height: '70%',
    backgroundColor: '#ffcca2',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    zIndex: -1, // Garante que o fundo fique atrás do card
  },
  headerTitle: {
    fontSize: 32,
    color: '#000000',
    marginTop: 50,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#ffe8d5',
    width: '90%',
    borderRadius: 15,
    padding: 30, // Aumenta o padding interno do card para mais espaço
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    marginTop: 200, // Ajusta a posição vertical do card
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30, // Aumenta o espaço entre os inputs
  },
  icon: {
    marginRight: 15, // Aumenta o espaço entre o ícone e o texto
  },
  inputContainer: {
    flex: 1,
  },
  label: {
    fontSize: 14, // Tamanho maior para melhor leitura
    fontWeight: 'bold',
    marginBottom: 8, // Mais espaço entre a label e o campo
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    fontSize: 16, // Texto maior nos inputs
    color: '#000',
    paddingVertical: 6, // Aumenta o espaço interno dos inputs
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  picker: {
    width: '100%',
    height: 40,
  },
  addButton: {
    backgroundColor: '#67adf4',
    paddingVertical: 15, // Aumenta o tamanho do botão
    paddingHorizontal: 40,
    borderRadius: 25,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18, // Texto maior no botão
    fontWeight: 'bold',
  },
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
    position: 'absolute', // Permite que o footer fique fixo na parte inferior
    bottom: 0, // Fixado na parte inferior
  },
});


export default AddMedicaoScreen;
