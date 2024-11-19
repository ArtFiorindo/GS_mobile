import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
  ActivityIndicator,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Footer from '../components/Footer';

const MedicoesScreen = ({ navigation }: { navigation: any }) => {
  const [medicoes, setMedicoes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingMedicaoId, setEditingMedicaoId] = useState<number | null>(null);
  const [editingKwh, setEditingKwh] = useState<string>('');
  const [editingTorre, setEditingTorre] = useState<string>('');

  const API_URL_MEDICOES = 'http://localhost:3000/api/medicoes';
  const API_URL_UPDATE_MEDICAO = 'http://localhost:3000/api/medicoes/';
  const API_URL_DELETE_MEDICAO = 'http://localhost:3000/api/medicoes/';

  useEffect(() => {
    fetchMedicoes();
  }, []);

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
        setMedicoes(data);
      } else {
        Alert.alert('Erro', data.error || 'Erro ao buscar as medições.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateMedicao = async (id: number) => {
    if (!editingKwh || !editingTorre) {
      Alert.alert('Erro', 'Todos os campos devem ser preenchidos.');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`${API_URL_UPDATE_MEDICAO}${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ kwh: editingKwh, torre: editingTorre }),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Sucesso', 'Medição atualizada com sucesso!');
        setEditingMedicaoId(null);
        fetchMedicoes();
      } else {
        Alert.alert('Erro', data.error || 'Erro ao atualizar a medição.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
    }
  };

  const handleDeleteMedicao = async (id: number) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`${API_URL_DELETE_MEDICAO}${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        Alert.alert('Sucesso', 'Medição excluída com sucesso!');
        fetchMedicoes();
      } else {
        const data = await response.json();
        Alert.alert('Erro', data.error || 'Erro ao excluir a medição.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
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
        <Text style={styles.headerTitle}>Gerenciar Medições</Text>
      </View>

      <FlatList
        data={medicoes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Text style={styles.cardTitle}>Torre</Text>
              {editingMedicaoId === item.id ? (
                <Picker
                  selectedValue={editingTorre}
                  onValueChange={(value) => setEditingTorre(value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Torre A" value="Torre A" />
                  <Picker.Item label="Torre B" value="Torre B" />
                  <Picker.Item label="Torre C" value="Torre C" />
                </Picker>
              ) : (
                <Text style={styles.cardValue}>{item.torre}</Text>
              )}

              <Text style={styles.cardTitle}>kWh</Text>
              {editingMedicaoId === item.id ? (
                <TextInput
                  style={styles.input}
                  value={editingKwh}
                  onChangeText={setEditingKwh}
                  placeholder="Editar kWh"
                  keyboardType="numeric"
                />
              ) : (
                <Text style={styles.cardValue}>{item.kwh}</Text>
              )}

              <Text style={styles.cardDate}>
                Data: {new Date(item.created_at).toLocaleString()}
              </Text>
            </View>

            <View style={styles.cardActions}>
              {editingMedicaoId === item.id ? (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleUpdateMedicao(item.id)}
                >
                  <Ionicons name="checkmark-outline" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => {
                    setEditingMedicaoId(item.id);
                    setEditingKwh(item.kwh.toString());
                    setEditingTorre(item.torre);
                  }}
                >
                  <Ionicons name="pencil-outline" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: '#FF4D4D' }]}
                onPress={() => handleDeleteMedicao(item.id)}
              >
                <Ionicons name="trash-outline" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

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
    width: '100%',
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
  cardValue: {
    fontSize: 14,
    color: '#555555',
    marginBottom: 5,
  },
  cardDate: {
    fontSize: 12,
    color: '#888888',
  },
  picker: {
    width: '100%',
  },
  cardActions: {
    flexDirection: 'row',
    marginTop: 10,
  },
  actionButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    fontSize: 14,
    color: '#000',
    marginTop: 5,
  },
});

export default MedicoesScreen;