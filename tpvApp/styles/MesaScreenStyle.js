import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#2C2C2C', // Fondo gris oscuro
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#3E3E3E', // Ajustado para mayor contraste
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 20,
    },
    categoryItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#5A5A5A',
        width: '100%',
        backgroundColor: '#444444', // Fondo oscuro para categorías
        borderRadius: 8,
        marginBottom: 8,
    },
    categoryText: {
        fontSize: 18,
        color: '#FFFFFF',
        textAlign: 'center',
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: '#FF9500',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    closeButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    categoryTabs: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#444444', // Tab color
        paddingVertical: 8,
    },
    categoryTabsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    categoryTab: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#555555',
        borderRadius: 10,
        marginHorizontal: 5,
    },
    activeCategoryTab: {
        backgroundColor: '#2196F3',
    },
    categoryTabText: {
        fontSize: 18,
        color: '#FFFFFF',
        textAlign: 'center',
    },
    activeCategoryTabText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    productContainer: {
        flex: 1,
    },
    productGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        marginTop: 10,
    },
    productButton: {
        width: '48%',
        backgroundColor: '#5A5A5A', // Fondo del producto
        marginBottom: 12,
        padding: 15,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    productButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    floatingButton: {
        position: 'absolute',
        bottom: 80,
        right: 20,
        backgroundColor: '#FF4081',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    floatingButton2: {
        position: 'absolute',
        bottom: 160,
        right: 20,
        backgroundColor: '#FF4081',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    floatingButton3: {
        position: 'absolute',
        bottom: 240,
        right: 20,
        backgroundColor: '#FF4081',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    floatingButtonText: {
        fontSize: 24,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#3E3E3E',
        borderBottomWidth: 1,
        borderBottomColor: '#555555',
    },
    headerMesaText: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    headerPriceText: {
        fontSize: 20,
        fontWeight: '600',
        color: '#FF9500',
    },
    upperContainer: {
        height: '50%',
        backgroundColor: '#3E3E3E', // Ajuste de fondo si es necesario
    },
    lowerContainer: {
        flex: 1,
        backgroundColor: '#2C2C2C',
        paddingTop: 10, // Espaciado entre contenedores
        paddingBottom: 70,
    },
    productList: {
        flex: 1,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    // Estilo para cada item de producto
    productItem: {
        backgroundColor: '#FFFFFF',
        padding: 15,
        marginBottom: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,  // Sombra más notoria en Android
    },
    productItemFactura: {
        backgroundColor: 'orange',
        padding: 15,
        marginBottom: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,  // Sombra más notoria en Android
    },
    // Contenedor de los detalles del producto
    productDetails: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    // Contenedor para el nombre y el precio del producto
    productInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',  // Distribuye el nombre y precio a los extremos
        alignItems: 'center',
        width: '100%',
    },
    // Estilo para el texto del producto
    productText: {
        fontSize: 20,
        color: '#333',
    },
    // Estilo para el precio
    priceText: {
        fontSize: 20,
        color: '#28a745',  // Color verde para el precio
        fontWeight: 'bold',
    },
    // Contenedor de la cantidad con botones de incremento y decremento
    quantityControl: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 10,
    },
    // Estilo de los botones de cantidad
    quantityButton: {
        backgroundColor: '#007BFF',  // Color de fondo más atractivo
        borderRadius: 5,
        padding: 8,
        width: 35,
        alignItems: 'center',
        justifyContent: 'center',
    },
    quantityButtonText: {
        fontSize: 20,
        color: '#fff',  // Botones más visibles con texto blanco
        fontWeight: 'bold',  // Hacer los textos más destacados
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    modalButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    discardButton: {
        backgroundColor: '#f44336', // Rojo
    },
    cancelButton: {
        backgroundColor: '#4CAF50', // Verde
    },
    modalButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default styles;
