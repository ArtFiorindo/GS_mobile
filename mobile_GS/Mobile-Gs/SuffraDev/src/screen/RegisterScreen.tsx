import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const RegisterScreen: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
  
    
    const handleRegister = async () => {
      if (!username || !email || !password || !confirmPassword) {
        Alert.alert('Erro', 'Todos os campos são obrigatórios.');
        return;
      }
  
      if (password !== confirmPassword) {
        Alert.alert('Erro', 'As senhas não coincidem.');
        return;
      }
  
      setLoading(true);
  
      try {
        const response = await fetch('http://localhost:3000/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            email,
            password,
            role: 'user',  
          }),
        });
  
        if (response.ok) {
          Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!');
          navigation.navigate('LoginScreen');
        } else {
          const errorData = await response.json();
          Alert.alert('Erro', errorData.error || 'Erro ao cadastrar usuário');
        }
      } catch (error) {
        Alert.alert('Erro', 'Falha ao conectar com o servidor.');
      } finally {
        setLoading(false);
      }
    };
  
    const handleNavigateToLogin = () => {
      navigation.navigate('LoginScreen');
    };

  return (
    <LinearGradient colors={['#3B3C31', '#53572E']} style={styles.container}>
       <View style={styles.header}>
        <Image source={require('../../assets/Suffra-w.png')} style={styles.logoImage} />
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
        <FontAwesome name="envelope" style={styles.iconStyle} />
        <TextInput
          placeholder="Email"
          placeholderTextColor="#AFAFAF"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          style={styles.input}
        />
      </View>

      <View style={styles.inputContainer}>
        <FontAwesome name="lock" style={styles.iconStyle} />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#AFAFAF"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
      </View>

      <View style={styles.inputContainer}>
        <FontAwesome name="lock" style={styles.iconStyle} />
        <TextInput
          placeholder="Confirm Password"
          placeholderTextColor="#AFAFAF"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={styles.input}
        />
      </View>

      <TouchableOpacity onPress={handleRegister} disabled={loading}>
        <LinearGradient colors={['#F2BF60', '#FFA600']} style={styles.button}>
          <Text style={styles.buttonText}>{loading ? 'Cadastrando...' : 'Cadastrar'}</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleNavigateToLogin} style={styles.registerLink}>
        <Text style={styles.registerText}>
          Já tem uma conta? <Text style={styles.registerHighlight}>Login</Text>
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
  logoImage: {
    width: 200, // Tamanho da imagem
    height: 200,
    resizeMode: 'contain',
    marginTop: -100, // Move apenas a imagem para cima
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
    color: '#0B0B0B',
  },
  registerText: {
    marginTop: 25,
    color: '#FFF',
    fontSize: 14,
    textAlign: 'center',
  },
  registerHighlight: {
    color: '#F9A825',
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
