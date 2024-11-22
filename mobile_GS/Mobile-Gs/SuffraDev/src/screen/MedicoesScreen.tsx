import React, { useState, useEffect, useCallback } from 'react';
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
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Footer from '../components/Footer';

const { height } = Dimensions.get('window'); // Obtém a altura da tela

const MedicoesScreen = ({ navigation }: { navigation: any }) => {
  const [medicoes, setMedicoes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingMedicaoId, setEditingMedicaoId] = useState<number | null>(null);
  const [editingKwh, setEditingKwh] = useState<string>('');
  const [editingTorre, setEditingTorre] = useState<string>('');

  const API_URL_MEDICOES = 'http://localhost:3000/api/medicoes';
  const API_URL_UPDATE_MEDICAO = 'http://localhost:3000/api/medicoes/';
  const API_URL_DELETE_MEDICAO = 'http://localhost:3000/api/medicoes/';

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
        const sortedData = data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setMedicoes(sortedData);
      } else {
        Alert.alert('Erro', data.error || 'Erro ao buscar as medições.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMedicoes();
    }, [])
  );

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
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#ffffff', '#ffffff']} style={styles.header}>
        <Image source={require('../../assets/Suffra.png')} style={styles.logoImage} />
        <Text style={styles.headerTitle}>Histórico de Medição</Text>
      </LinearGradient>

      {/* Lista de Medições com altura limitada */}
      <View style={styles.listContainer}>
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

                <Text style={styles.cardTitle}>Gasto em Kwh</Text>
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
                  Data: {new Date(item.created_at).toLocaleString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
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
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Footer fixo */}
      <Footer navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 40,
    paddingBottom: 20,
    alignItems: 'center',
  },
  logoImage: {
    width: 130,
    height: 130,
    resizeMode: 'contain',
    marginTop: -40,
    top: -10, // Ajustar a margem superior
    left: -130, // Ajustar a margem à esquerda
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 10,
  },
  listContainer: {
    flex: 1,
    maxHeight: height * 0.75, // Limita a altura para 75% da tela
    backgroundColor: '#ffcca2',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    padding: 20,
  },
  card: {
    backgroundColor: '#ffe8d5',
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  cardValue: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  cardDate: {
    fontSize: 12,
    color: '#888',
  },
  cardActions: {
    flexDirection: 'row',
  },
  actionButton: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 5,
    marginLeft: 10,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    fontSize: 16,
    color: '#000',
    paddingVertical: 5,
  },
});

export default MedicoesScreen;
