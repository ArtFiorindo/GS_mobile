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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
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
    <LinearGradient colors={['#ffffff', '#ffffff']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require('../../assets/Suffra.png')} style={styles.logoImage} />
        <Text style={styles.headerTitle}>Gerenciar Medições</Text>
      </View>

      {/* Lista de Medições */}
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
        />
      </View>

      {/* Footer Fixo */}
      <Footer navigation={navigation} />
    </LinearGradient>
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
    top: 5, // Ajustar a margem superior
    left: -130, // Ajustar a margem à esquerda
  },
  headerTitle: {
    fontSize: 28,
    color: '#000000',
    marginTop: 10,
    fontWeight: 'bold',
  },
  listContainer: {
    flex: 1,
    backgroundColor: '#ffcca2', // Fundo do cartão maior (mais escuro)
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    marginTop: 40,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 60, // Espaço para o Footer
  },
  listContent: {
    paddingBottom: 20, // Espaço entre o final da lista e o Footer
  },
  card: {
    backgroundColor: '#ffe8d5', // Fundo mais claro para os itens individuais
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3, // Sombra para Android
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 5,
  },
  cardValue: {
    fontSize: 16,
    color: '#555555',
    marginBottom: 10,
  },
  cardDate: {
    fontSize: 12,
    color: '#888888',
  },
  cardActions: {
    flexDirection: 'row',
  },
  actionButton: {
    backgroundColor: '#4CAF50', // Botão verde para editar
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  deleteButton: {
    backgroundColor: '#FF4D4D', // Botão vermelho para excluir
    padding: 10,
    borderRadius: 5,
  },
  picker: {
    width: '100%',
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
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    height: 60,
    backgroundColor: '#ffe8d5', // Fundo claro para o Footer
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    position: 'absolute',
    bottom: 0, // Fixa o Footer na parte inferior
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -3 },
    shadowRadius: 4,
  },
});

export default MedicoesScreen;


