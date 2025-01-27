import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    padding: 15,
  },
  form: {
    flexDirection: 'column',
    padding: 20,
    backgroundColor: '#1f1f1f',
    borderRadius: 12,
    elevation: 10, // Sombra más pronunciada
    width: '90%',
    maxWidth: 450,
    color: '#f5f5f5',
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 28, // Mayor tamaño para el encabezado
    fontWeight: '600', // Fuente más ligera para un aspecto moderno
  },
  text: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'left', // Alinear a la izquierda
  },
  inputGroup: {
    marginBottom: 20, // Más espacio entre los campos
    alignItems: 'center', // Alineación centrada
    minWidth: '80%',
  },
  label: {
    marginBottom: 8, // Más espacio entre label y el input
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500', // Ligera negrita para un toque estiloso
  },
  input: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 8,
    backgroundColor: '#333',
    color: '#ffffff',
    fontSize: 16,
    width: '100%',
    minWidth: 250,  // Definir anchura mínima de 250px
    marginBottom: 10, // Separación entre los inputs
  },
  errorMessage: {
    color: '#ff6b6b',
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold', // Resaltar el error con un poco de negrita
  },
  button: {
    padding: 14,
    backgroundColor: '#007bff',
    borderRadius: 8,
    width: '100%',
    marginTop: 10,
    alignItems: 'center', // Centrar el texto del botón
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600', // Negrita para el texto del botón
    textAlign: 'center', // Centrado
  },
  activityIndicator: {
    marginTop: 10,
  },
});

export default styles;
