import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Footer from '../components/Footer';

const UserScreen = ({ navigation }: { navigation: any }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [tempUsername, setTempUsername] = useState('');
  const [tempEmail, setTempEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const API_URL_ME = 'http://localhost:3000/api/me';
  const API_URL_UPDATE = 'http://localhost:3000/api/update';

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          Alert.alert('Erro', 'Token não encontrado. Faça login novamente.');
          navigation.replace('LoginScreen');
          return;
        }

        const response = await fetch(API_URL_ME, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setUsername(data.username);
          setEmail(data.email);
          setTempUsername(data.username);
          setTempEmail(data.email);
        } else {
          Alert.alert('Erro', data.error || 'Não foi possível carregar os dados do usuário.');
          if (response.status === 401) {
            await AsyncStorage.removeItem('authToken');
            navigation.replace('LoginScreen');
          }
        }
      } catch (error) {
        Alert.alert('Erro', 'Falha ao conectar ao servidor.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigation]);

  const updateUser = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        Alert.alert('Erro', 'Token não encontrado. Faça login novamente.');
        navigation.replace('LoginScreen');
        return;
      }

      const response = await fetch(API_URL_UPDATE, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: isEditingUsername ? tempUsername : undefined,
          email: isEditingEmail ? tempEmail : undefined,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setUsername(tempUsername);
        setEmail(tempEmail);
        Alert.alert('Sucesso', data.message || 'Usuário atualizado com sucesso!');
      } else {
        Alert.alert('Erro', data.error || 'Erro ao atualizar o usuário.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
    } finally {
      setIsEditingUsername(false);
      setIsEditingEmail(false);
    }
  };

  const handleCancelEdit = () => {
    setTempUsername(username);
    setTempEmail(email);
    setIsEditingUsername(false);
    setIsEditingEmail(false);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('authToken');
    Alert.alert('Logout', 'Você foi desconectado!');
    navigation.replace('LoginScreen');
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

      <View style={styles.backgroundElement} />
      {/* Header */}
      <View style={styles.header}>
      <Image source={require('../../assets/Suffra.png')} style={styles.logoImage} />
        <Text style={styles.headerTitle}>Tela Usuário</Text>
      </View>

      {/* User Info Section */}
      <View style={styles.card}>
        <View style={styles.profilePicture}>
          <Ionicons name="person-circle-outline" size={80} color="#D3D3D3" />
        </View>
        <View style={styles.infoContainer}>
          {/* Username */}
          <Text style={styles.label}>Username</Text>
          {isEditingUsername ? (
            <>
              <TextInput
                style={styles.input}
                value={tempUsername}
                onChangeText={setTempUsername}
              />
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.saveButton} onPress={updateUser}>
                  <Text style={styles.buttonText}>Salvar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={handleCancelEdit}>
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={styles.editableRow}>
              <Text style={styles.text}>{username}</Text>
              <TouchableOpacity onPress={() => setIsEditingUsername(true)}>
                <Text style={styles.editLink}>editar</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Email */}
          <Text style={styles.label}>Email</Text>
          {isEditingEmail ? (
            <>
              <TextInput
                style={styles.input}
                value={tempEmail}
                onChangeText={setTempEmail}
              />
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.saveButton} onPress={updateUser}>
                  <Text style={styles.buttonText}>Salvar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={handleCancelEdit}>
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={styles.editableRow}>
              <Text style={styles.text}>{email}</Text>
              <TouchableOpacity onPress={() => setIsEditingEmail(true)}>
                <Text style={styles.editLink}>editar</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Texto para Alterar Senha */}
            <TouchableOpacity onPress={() => navigation.navigate('ResetPasswordScreen')}>
                <Text style={styles.resetPasswordLink}>Alterar minha senha</Text>
            </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
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
    backgroundColor: '#ffffff', // Fundo branco geral
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  backgroundElement: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '80%',
    backgroundColor: '#ffcca2', // Cor mais escura para o fundo
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    zIndex: -1,
  },
  header: {
    marginTop: 20,
    alignItems: 'flex-start',
    width: '90%',
  },
  logoImage: {
    width: 130,
    height: 130,
    resizeMode: 'contain',
    marginTop: -40,
    top: 10,
    left: 0,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 10,
    alignSelf: 'center',
  },
  card: {
    backgroundColor: '#ffe8d5', // Fundo mais claro
    width: '90%',
    height: '50%',
    borderRadius: 50,
    paddingTop: 90,
    marginTop: 50,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
  },
  profilePicture: {
    marginTop: -40,
    marginBottom: 20,
  },
  infoContainer: {
    width: '100%',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    color: '#000000',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  text: {
    fontSize: 18,
    color: '#000000',
    marginBottom: 5,
  },
  editableRow: {
    alignItems: 'center',
    marginBottom: 20,
  },
  editLink: {
    fontSize: 14,
    color: '#0000FF',
    textDecorationLine: 'underline',
    marginTop: 5,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    fontSize: 16,
    color: '#000000',
    marginBottom: 20,
    width: '90%',
    textAlign: 'center',
  },
  resetPasswordLink: {
    fontSize: 16,
    color: '#0000FF',
    textDecorationLine: 'underline',
    marginTop: 15,
  },
  saveButton: {
    backgroundColor: '#4CAF50', // Verde para o botão de salvar
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: '#FF4D4D', // Vermelho para o botão de cancelar
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#FF4D4D',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 20,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 55,
    backgroundColor: '#ffe8d5',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});

export default UserScreen;



