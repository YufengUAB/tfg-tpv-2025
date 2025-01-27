import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getMesasActivas } from '../services/mesaService';
import { useUser } from '../context/userContext';
import { useIP } from '../context/ipContext';
import styles from '../styles/HomeScreenStyle';

const MainPage = () => {
  const { ipAddress } = useIP();
  const [mesa, setMesa] = useState('');
  const [mesasActivas, setMesasActivas] = useState([]);
  const navigation = useNavigation();
  const { userData } = useUser();

  useEffect(() => {
    if (!userData || !ipAddress) {
      // Si falta userData o la dirección IP, redirige a la pantalla de inicio de sesión
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } 
  }, [userData, ipAddress, navigation]);


  // Fetch de mesas activas y configuración del intervalo
  useEffect(() => {
    const fetchMesas = async () => {
      try {
        const mesas = await getMesasActivas(ipAddress);
        setMesasActivas(mesas);
      } catch (error) {
        console.error('Error al obtener mesas activas:', error);
      }
    };

    fetchMesas();
    const intervalId = setInterval(fetchMesas, 10000);

    return () => clearInterval(intervalId);
  }, [ipAddress]);

  // Navegación a la página de mesa seleccionada
  const toMesaPage = (mesa) => {
    navigation.navigate('Mesa', { mesa });
  };

  // Manejo del numpad
  const handleNumpadClick = (value) => {
    setMesa((prevMesa) => prevMesa + value);
  };

  const handleBackspace = () => {
    setMesa((prevMesa) => prevMesa.slice(0, -1));
  };

  const handleConfirm = () => {
    if (mesa) {
      setMesa('');
      navigation.navigate('Mesa', { mesa });
    } else {
      alert('Por favor selecciona un número de mesa.');
    }
  };

  const handleUserClick = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  const handleIPClick = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'IPPage' }],
    });
  };

  return (
    <View style={styles.mainContainer}>
      {/* Sección de mesas activas */}
      <ScrollView style={styles.mesasSection}>
        {mesasActivas.map((mesaActiva) => (
          <TouchableOpacity
            key={mesaActiva.id_mesa}
            onPress={() => toMesaPage(mesaActiva.numero)}
            style={[
              styles.mesaButton,
              mesaActiva.estado === 2 ? styles.mesaButtonEstado2 : null,
            ]}
          >
            <Text style={styles.mesaButtonText}>{mesaActiva.numero}</Text>
          </TouchableOpacity>
        ))}
        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Sección de numpad */}
      <View style={styles.numpadSection}>
        <TextInput
          value={mesa}
          editable={false}
          style={styles.mesaDisplay}
        />

        <View style={styles.numpadWrapper}>
          <View style={styles.lettersColumn}>
            {['A', 'B', 'C', 'D'].map((letter) => (
              <TouchableOpacity
                key={letter}
                onPress={() => handleNumpadClick(letter)}
                style={[styles.numpadButton, styles.innerButton]}
              >
                <Text style={styles.numpadButtonText}>{letter}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.numbersColumn}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
              <TouchableOpacity
                key={number}
                onPress={() => handleNumpadClick(number.toString())}
                style={[styles.numpadButton, styles.numpadInnerButton]}
              >
                <Text style={styles.numpadButtonText}>{number}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => handleNumpadClick('#')} style={[styles.numpadButton, styles.numpadInnerButton]}>
              <Text style={styles.numpadButtonText}>#</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleNumpadClick('0')} style={[styles.numpadButton, styles.numpadInnerButton]}>
              <Text style={styles.numpadButtonText}>0</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleNumpadClick('*')} style={[styles.numpadButton, styles.numpadInnerButton]}>
              <Text style={styles.numpadButtonText}>*</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity onPress={handleBackspace} style={[styles.numpadButton, styles.actionButton]}>
              <Text style={styles.numpadButtonText}>←</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleConfirm} style={[styles.numpadButton, styles.confirmButton]}>
              <Text style={styles.numpadButtonText}>↵</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleIPClick} style={[styles.numpadButton, styles.confirmButton]}>
              <Text style={styles.numpadButtonText}>IP</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleUserClick} style={[styles.numpadButton, styles.configButton]}>
              <Text style={styles.numpadButtonText}>👤</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default MainPage;
