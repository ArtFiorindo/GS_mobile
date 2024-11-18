import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    <LinearGradient colors={['#000000', '#000000']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logoText}>⚡ Clean Energy</Text>
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

      {/* Footer with Navigation Icons */}
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
  card: {
    backgroundColor: '#FFFFFF',
    width: '80%',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
  },
  profilePicture: {
    marginBottom: 20,
  },
  infoContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#555555',
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    color: '#000000',
    marginBottom: 10,
  },
  editableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  editLink: {
    fontSize: 14,
    color: '#0000FF',
    textDecorationLine: 'underline',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    fontSize: 16,
    color: '#000000',
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: '#FF0000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#FF0000',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  resetPasswordLink: {
    fontSize: 14,
    color: '#0000FF',
    textDecorationLine: 'underline',
    marginTop: 10,
    alignSelf: 'flex-start',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingBottom: 20,
  },
});

export default UserScreen;
