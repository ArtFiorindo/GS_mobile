import React from 'react';
import { View } from 'react-native';
import Header from './Header';
import Footer from './Footer';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <View style={{ flex: 1 }}>
      <Header />
      <View style={{ flex: 1, padding: 20 }}>{children}</View>
      <Footer />
    </View>
  );
};

export default Layout;