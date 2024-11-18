import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const ResetPasswordScreen: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigation = useNavigation();

  const handleResetPassword = async () => {
    if (!email || !newPassword || !confirmNewPassword) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          newPassword,
        }),
      });

      if (response.ok) {
        Alert.alert('Sucesso', 'Senha redefinida com sucesso!');
        navigation.replace('LoginScreen');
      } else {
        const errorData = await response.json();
        Alert.alert('Erro', errorData.error || 'Erro ao redefinir a senha.');
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#3B3C31', '#53572E']} style={styles.container}>
      {/* Back Arrow */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={30} color="#FFF" />
      </TouchableOpacity>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logoText}>⚡ Clean Energy</Text>
        <Text style={styles.title}>
          Esqueceu a sua senha{'\n'}Não tem problema!
        </Text>
        <Text style={styles.subtitle}>
          Apenas informe seu email e adicione sua nova senha!
        </Text>
      </View>

      {/* Inputs */}
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
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
          style={styles.input}
        />
      </View>

      <View style={styles.inputContainer}>
        <FontAwesome name="lock" style={styles.iconStyle} />
        <TextInput
          placeholder="Confirm password"
          placeholderTextColor="#AFAFAF"
          secureTextEntry
          value={confirmNewPassword}
          onChangeText={setConfirmNewPassword}
          style={styles.input}
        />
      </View>

      {/* Button */}
      <TouchableOpacity onPress={handleResetPassword} disabled={loading}>
        <LinearGradient colors={['#F2BF60', '#FFA600']} style={styles.button}>
          {loading ? (
            <ActivityIndicator color="#0b0b0b" />
          ) : (
            <Text style={styles.buttonText}>Confirmar</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>

      {/* Back to Login */}
      <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')} style={styles.registerLink}>
        <Text style={styles.registerText}>
          Lembrou sua senha? <Text style={styles.registerHighlight}>Faça o Login</Text>
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
    paddingHorizontal: 20,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoText: {
    fontSize: 30,
    color: '#F9DA50',
    fontWeight: '100',
  },
  title: {
    fontSize: 20,
    color: '#FFF',
    textAlign: 'center',
    marginTop: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#AFAFAF',
    textAlign: 'center',
    marginTop: 10,
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

export default ResetPasswordScreen;
