import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Importe o ícone
import { useNavigation } from '@react-navigation/native'; // Hook de navegação

const Header: React.FC = () => {
  const navigation = useNavigation(); // Obtenha o objeto de navegação

  const handleSettingsPress = () => {
    navigation.navigate('ConfiguracaoScreen'); // Navega para a tela de configurações
  };

  return (
    <View style={{ height: 60, backgroundColor: '#8C82FC', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', paddingHorizontal: 15 }}>
      <Text style={{ color: 'white', fontSize: 18 }}>OnData</Text>
      <TouchableOpacity onPress={handleSettingsPress}>
        <Icon name="settings" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

export default Header;
