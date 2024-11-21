import React from 'react';
import { NativeBaseProvider } from 'native-base';
import AppNavigator from './src/navigation/AppNavigator';
import { ProvedorEstadoGlobal } from './src/hooks/EstadoGlobal'; // Se você usar um estado global

export default function App() {
  return (
    <NativeBaseProvider>
      <ProvedorEstadoGlobal>
        <AppNavigator />
      </ProvedorEstadoGlobal>
    </NativeBaseProvider>
  );
}
