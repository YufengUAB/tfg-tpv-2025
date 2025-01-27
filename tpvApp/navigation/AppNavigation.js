import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MainPage from '../screens/HomeScreen';
import LoginPage from '../screens/LoginScreen';
import IPPage from '../screens/IPScreen';
import MesaPage from '../screens/MesaScreen';

const Stack = createStackNavigator();

const AppNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="IPPage">
        <Stack.Screen 
          name="Home" 
          component={MainPage} 
          options={{ title: 'Inicio' }} // Opciones para el header
        />
        <Stack.Screen
            name="Login"
            component={LoginPage}
            options={{ title: 'Inicio de Sesión' }}
        />
        <Stack.Screen
            name="IPPage"
            component={IPPage}
            options={{ title: 'IP del Servidor' }}
        />
        <Stack.Screen
            name="Mesa"
            component={MesaPage}
            options={{ title: 'Mesa' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;
