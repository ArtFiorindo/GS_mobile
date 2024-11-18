import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const API_URL = 'http://localhost:3000/api/login';

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao fazer login');
      }

      const { token } = await response.json();

      // Armazene o token no AsyncStorage
      await AsyncStorage.setItem('authToken', token);

      Alert.alert('Sucesso', 'Login realizado com sucesso!');
      navigation.replace('HomeScreen'); // Redireciona para a HomeScreen
    } catch (err: any) {
      Alert.alert('Erro', err.message || 'Erro ao autenticar.');
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToRegister = () => {
    navigation.navigate('RegisterScreen');
  };

  const handleNavigateToResetPassword = () => {
    navigation.navigate('ResetPasswordScreen');
  };

  return (
    <LinearGradient colors={['#3B3C31', '#53572E']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logoText}>⚡ Clean Energy</Text>
      </View>

      <View style={styles.inputContainer}>
        <FontAwesome name="user" style={styles.iconStyle} />
        <TextInput
          placeholder="Username"
          placeholderTextColor="#AFAFAF"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />
      </View>

      <View style={styles.inputContainer}>
        <FontAwesome name="lock" style={styles.iconStyle} />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#AFAFAF"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />
      </View>

      <TouchableOpacity onPress={handleLogin} disabled={loading}>
        <LinearGradient colors={['#F2BF60', '#FFA600']} style={styles.button}>
          {loading ? (
            <ActivityIndicator color="#0b0b0b" />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleNavigateToResetPassword} style={styles.forgotPasswordLink}>
        <Text style={styles.forgotPasswordText}>Esqueceu sua senha?</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleNavigateToRegister} style={styles.registerLink}>
        <Text style={styles.registerText}>
          Não tem uma conta? <Text style={styles.registerHighlight}>Cadastre-se</Text>
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 50,
    alignItems: 'center',
  },
  logoText: {
    fontSize: 30,
    color: '#F9DA50',
    fontWeight: '100',
  },
  inputContainer: {
    width: '85%',
    marginBottom: 20,
    position: 'relative',
  },
  input: {
    width: '100%',
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#AFAFAF',
    fontSize: 16,
    color: '#FFF',
    paddingLeft: 40,
  },
  iconStyle: {
    position: 'absolute',
    left: 10,
    top: 15,
    color: '#AFAFAF',
  },
  button: {
    width: 190,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    color: '#0b0b0b',
  },
  forgotPasswordLink: {
    marginTop: 15,
  },
  forgotPasswordText: {
    color: '#FFF',
    fontSize: 14,
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
  registerLink: {
    marginTop: 25,
  },
  registerText: {
    color: '#FFF',
    fontSize: 14,
    textAlign: 'center',
  },
  registerHighlight: {
    color: '#F9A825',
    fontWeight: 'bold',
  },
});

export default LoginScreen;