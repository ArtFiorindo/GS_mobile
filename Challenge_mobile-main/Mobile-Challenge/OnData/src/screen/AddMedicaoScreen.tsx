import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
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
    if (!username || !torre || !kwh) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios!');
      return;
    }

    try {
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
        Alert.alert('Erro', data.error || 'Usuário não encontrado.');
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
      Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
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
    <LinearGradient colors={['#000000', '#000000']} style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../../assets/image.png')} style={styles.logoImage} />
        <Text style={styles.headerTitle}>Adicionar Medição</Text>
      </View>

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
  logoImage: {
    width: 140,
    height: 140,
    resizeMode: 'contain',
    marginTop: -60,
  },
  headerTitle: {
    fontSize: 32,
    color: '#FFFFFF',
    marginTop: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    width: '85%',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  icon: {
    marginRight: 15,
  },
  inputContainer: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: '#555555',
    marginBottom: 5,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    fontSize: 16,
    color: '#000000',
    paddingVertical: 5,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    width: '100%',
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    height: 40,
  },
  addButton: {
    backgroundColor: '#67adf4',
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
});

export default AddMedicaoScreen;
