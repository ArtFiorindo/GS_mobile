import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import LoginScreen from '../screen/LoginScreen';
import RegisterScreen from '../screen/RegisterScreen';
import HomeScreen from '../screen/HomeScreen';
import AboutScreen from '../screen/AboutScreen';
import UserScreen from '../screen/UserScreen';
import ResetPasswordScreen from '../screen/ResetPasswordScreen';




const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">
        
        <Stack.Screen 
          name="LoginScreen" 
          component={LoginScreen} 
          options={{ headerShown: false }} 
        />

        <Stack.Screen 
          name="RegisterScreen" 
          component={RegisterScreen} 
          options={{ headerShown: false }} 
        />  

        <Stack.Screen 
          name="HomeScreen" 
          component={HomeScreen} 
          options={{ headerShown: false }} 
        />  
        
        <Stack.Screen 
          name="AboutScreen" 
          component={AboutScreen} 
          options={{ headerShown: false }} 
        />  

        <Stack.Screen 
          name="UserScreen" 
          component={UserScreen} 
          options={{ headerShown: false }} 
        />  

        <Stack.Screen 
          name="ResetPasswordScreen" 
          component={ResetPasswordScreen} 
          options={{ headerShown: false }} 
        />  

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
