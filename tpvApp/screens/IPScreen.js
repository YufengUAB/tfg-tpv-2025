import React, { useEffect, useState } from 'react';
import { View, TextInput, Text, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useIP } from '../context/ipContext'; 
import styles from '../styles/IPScreenStyle';  // Asegúrate de importar los estilos

const IPPage = () => {
  const { ipAddress, setIpAddress } = useIP(); // Accedemos a la IP desde el contexto
  const [inputIP, setInputIP] = useState(''); 
  const navigation = useNavigation(); // Hook de navegación

  useEffect(() => {
    if (ipAddress) {
      setInputIP(ipAddress);
    }
  }, [ipAddress, navigation]);

  const handleChange = (text) => {
    setInputIP(text);
  };

  const handleSubmit = () => {
    if (!inputIP) {
      Alert.alert("Error", "Por favor ingresa una IP válida.");
    } else {
      setIpAddress(inputIP);
      navigation.navigate('Login');
      Alert.alert("Éxito", "IP guardada correctamente.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.header}>Ingresa la IP del servidor:</Text>

        <TextInput
          style={styles.input}
          placeholder="IP del servidor"
          value={inputIP}
          onChangeText={handleChange}
        />

        <Button
          title="Guardar IP"
          onPress={handleSubmit}
          color="#007bff" // Color personalizado del botón
        />
      </View>
    </View>
  );
};

export default IPPage;
