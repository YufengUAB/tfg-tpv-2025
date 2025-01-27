import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, StyleSheet } from 'react-native';
import authService from '../services/authService'; 
import { useUser } from '../context/userContext';
import { useNavigation } from '@react-navigation/native';
import { useIP } from '../context/ipContext';
import styles from '../styles/LoginScreenStyle';

const LoginPage = () => {
  const { ipAddress } = useIP(); 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { userData, setUserData } = useUser();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    if (userData) {
      setUsername(userData.nombre_usuario);
      setPassword(userData.password);
    }
  }, [userData, navigation]);

  const handleSubmit = async () => {
    setLoading(true);

    if (!username || !password || !ipAddress) {
      setError('Por favor, completa todos los campos');
      setLoading(false);
      return;
    }

    try {
      const data = await authService.login(username, password, ipAddress);
      console.log('Inicio de sesión exitoso:', data);

      setUserData(data);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });

      setError('');
    } catch (error) {
      setError('Error al iniciar sesión: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Inicio de Sesión</Text>
      {error && <Text style={styles.errorMessage}>{error}</Text>}

      <View style={styles.inputGroup}>
        <Text style={styles.text}>Usuario:</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          required
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.text}>Contraseña:</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          required
        />
      </View>

      <Button
        title={loading ? 'Cargando...' : 'Iniciar Sesión'}
        onPress={handleSubmit}
        disabled={loading}
      />

      {loading && <ActivityIndicator size="large" color="#0000ff" />}
    </View>
  );
};

export default LoginPage;
