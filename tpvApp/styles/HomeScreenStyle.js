import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    mainContainer: {
        flexDirection: 'column', // Cambiado a columna para móviles
        height: '100%', // Asegura que ocupe todo el alto de la pantalla
    },
    mesasSection: {
        padding: 20,
        backgroundColor: '#1E1E1E',
        width: '100%', // Ahora ocupa todo el ancho
        overflowY: 'auto',
        flex: 1, // Ocupa el espacio disponible
    },
    mesaButton: {
        fontSize: 30,
        padding: 15,
        backgroundColor: '#3E3E3E',
        color: '#FFFFFF',
        borderRadius: 5,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mesaButtonEstado2: {
        backgroundColor: 'orange',
    },
    mesaButtonText: {
        color: '#FFFFFF',
        fontSize: 20, // Reducido el tamaño para mejor ajuste en móviles
    },
    numpadSection: {
        flexDirection: 'column', // Se mantiene en columna
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%', // Ahora ocupa todo el ancho
        padding: 20,
        backgroundColor: '#2C2C2C',
    },
    mesaDisplay: {
        fontSize: 30,
        padding: 15,
        width: '80%',
        textAlign: 'center',
        marginBottom: 20,
        backgroundColor: '#1E1E1E',
        color: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#3E3E3E',
    },
    numpadWrapper: {
        flexDirection: 'row', // Alineación en fila
        flexWrap: 'wrap', // Permite que los botones se ajusten a nuevas filas
        width: '100%', // Ocupa el 100% del ancho disponible
    },
    lettersColumn: {
        flexDirection: 'column', // Los botones se alinean verticalmente
        width: '25%', // Ocupa el 20% del ancho total
        justifyContent: 'space-around', // Asegura que los botones se distribuyan equitativamente en la columna
    },
    numbersColumn: {
        flexDirection: 'row',  // Los botones se organizan en filas dentro de esta columna
        flexWrap: 'wrap',      // Los elementos se envuelven a la siguiente fila
        width: '75%',          // Ocupa el 60% del ancho total
    },
    actions: {
        flexDirection: 'row', // Los botones de acción se organizan verticalmente
        width: '100%', // Ocupa el 20% del ancho total
        justifyContent: 'space-around', // Distribuye los botones en esta columna
        alignItems: 'center', // Centra los botones
    },
    numpadButton: {
        fontSize: 28, // Tamaño de fuente ajustado para móviles
        padding: 15, // Padding para que los botones tengan un tamaño adecuado
        backgroundColor: '#3E3E3E', // Color de fondo del botón
        color: '#FFFFFF', // Color del texto
        borderRadius: 5, // Bordes redondeados
        margin: 5, // Espacio entre los botones
        justifyContent: 'center', // Centra el contenido
        alignItems: 'center', // Alinea el contenido en el centro
        width: '22.5%', // Ancho ajustado para que 4 botones se acomoden en cada fila
        textAlign: 'center', // Alinea el texto en el centro
    },
    numpadButtonText: {
        color: '#FFFFFF', // Color del texto
        fontSize: 18, // Ajuste de tamaño de fuente
    },
    innerButton: {
        width: '91%', // Ocupa todo el ancho disponible
    },
    numpadInnerButton: {
        width: '29.8%', 
    },
    actionButton: {
        backgroundColor: '#FF4081', // Color de fondo para los botones de acción
    },
    confirmButton: {
        backgroundColor: '#FF4081', // Color de fondo para el botón de confirmar
    },
    configButton: {
        backgroundColor: '#FF4081', // Color de fondo para el botón de configuración
    },
});

export default styles;
