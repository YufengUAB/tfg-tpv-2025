import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import styles from '../styles/MesaScreenStyle';
import { getCategorias } from '../services/categoriaService';
import { getProductos } from '../services/productoService';
import { getMesaInfo, createMesayPedido, updateDetallePedidoV2, dropMesa } from '../services/gestionMesaService';
import { updatePedido } from '../services/pedidoService';
import { useIP } from '../context/ipContext';
import { useUser } from '../context/userContext';

const MesaPage = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [categorias, setCategorias] = useState([]);
    const [productos, setProductos] = useState([]);
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const [loading, setLoading] = useState(false);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
    const [productosMesa, setProductosMesa] = useState([]); // Nueva variable para almacenar los productos de la mesa
    const { ipAddress } = useIP();
    const route = useRoute();
    const navigation = useNavigation();
    const { mesa } = route.params;
    const { userData } = useUser();
    const [precioTotal, setPrecioTotal] = useState(0);
    const [nuevaMesa, setNuevaMesa] = useState(false);
    const [idPedido, setIdPedido] = useState(-1);
    const [initialDetallePedido, setInitialDetallePedido] = useState([]);
    const [mesaInfo, setMesaInfo] = useState(null);
    const [shouldUpdatePedido, setShouldUpdatePedido] = useState(false);
    const [totalAPagar, setTotalAPagar] = useState(0);
    const [pedido, setPedido] = useState(null);
    const [isFactura, setIsFactura] = useState(false);

    const fetchCategorias = async () => {
        try {
            const response = await getCategorias(ipAddress);
            setCategorias(response);
            if (response.length > 0) setCategoriaSeleccionada(response[0].id_categoria);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchProductos = async () => {
        try {
            const response = await getProductos(ipAddress);
            setProductos(response);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const fetchGetMesaInfo = async () => {
        try {
            const response = await getMesaInfo(mesa, ipAddress);
            console.log('Mesa info:', response);

            if (response === "") {
                setNuevaMesa(true);
            } else {
                console.log(response);

                if (response.mesa.estado === 3) {
                    navigate('/main');
                    return;
                }

                const productos = response.pedido.detallePedido;
                const initialProductos = response.pedido.detallePedido;

                setProductosMesa(productos);
                setInitialDetallePedido(initialProductos);
                setPrecioTotal(response.pedido.precioTotal);
                setMesaInfo(response.mesa);
                setNuevaMesa(false);

                if (response.mesa.estado === 2) {
                    setIsFactura(true);
                }

                setPedido(response.pedido);
                setIdPedido(response.pedido.idPedido);
            }
        } catch (error) {
            console.error('Error fetching mesa info:', error);
        }
    };


    useEffect(() => {
        if (categoriaSeleccionada !== null) {
            const filtrados = productos.filter(
                (producto) => producto.categoria === categoriaSeleccionada
            );
            setProductosFiltrados(filtrados);
        }
    }, [categoriaSeleccionada, productos]);

    useEffect(() => {
        const executeUpdates = async () => {
            if (shouldUpdatePedido) {
                try {
                    await updateDetallePedido();
                } catch (error) {
                    console.error("Error during updates:", error);
                } finally {
                    setShouldUpdatePedido(false);
                }
            }
        };

        executeUpdates();
    }, [productosMesa, shouldUpdatePedido]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await fetchCategorias();
            await fetchProductos();
            await fetchGetMesaInfo();
            setLoading(false);
        };

        fetchData();
    }, []);

    useEffect(() => {
        let total = 0;
        for (let i = 0; i < productosMesa.length; i++) {
            total += productosMesa[i].cantidad * productosMesa[i].precio_unitario;
        }
        setPrecioTotal(total);
    }, [productosMesa]);

    const handleSelectCategoria = (id_categoria) => {
        setCategoriaSeleccionada(id_categoria);
        setModalVisible(false);
    };

    const handleOpenModal = () => {
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };

    const handleIncrement = (id_producto) => {
        setProductosMesa((prevState) =>
            prevState.map((item) =>
                item.id_producto === id_producto
                    ? { ...item, cantidad: item.cantidad + 1 }
                    : item
            )
        );
    };

    const handleDecrement = (id_producto) => {
        setProductosMesa((prevState) =>
            prevState.map((item) =>
                item.id_producto === id_producto && item.cantidad > 1
                    ? { ...item, cantidad: item.cantidad - 1 }
                    : item
            )
        );
    };    

    const handleProductoClick = (producto) => {
        const productoExistente = productosMesa.find(
            (detalle) => detalle.id_producto === producto.id_producto
        );

        if (productoExistente) {
            setProductosMesa((prevProductosMesa) =>
                prevProductosMesa.map((detalle) =>
                    detalle.id_producto === producto.id_producto
                        ? { ...detalle, cantidad: detalle.cantidad + 1 }
                        : detalle
                )
            );
        } else {
            setProductosMesa((prevProductosMesa) => [
                ...prevProductosMesa,
                {
                    id_pedido: idPedido,
                    id_producto: producto.id_producto,
                    nombre: producto.nombre,
                    precio_unitario: producto.precio,
                    cantidad: 1,
                    pagados: 0,
                },
            ]);
        }
    };

    const handleConfirm = async () => {
        if (JSON.stringify(productosMesa) !== JSON.stringify(initialDetallePedido)) {
            if (nuevaMesa) {
                console.log('Creando nueva mesa...');
                try {
                    const response = await createMesayPedido(mesa, userData.id_usuario, ipAddress);
                    setIdPedido(response.id_pedido);
                    let mesaNew = {
                        id_mesa: response.id_mesa,
                    }
                    setMesaInfo(mesaNew);
                    setNuevaMesa(false);
                    const updatedDetallePedido = productosMesa.map(detalle => ({
                        ...detalle,
                        id_pedido: response.id_pedido,
                    }));
                    setProductosMesa(updatedDetallePedido);
                    setShouldUpdatePedido(true);
                } catch (error) {
                    console.error('Error al crear la mesa:', error);
                    alert('Hubo un error al crear la mesa.');
                }
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Home' }],
                });
            } else {
                updateDetallePedido();
            }
        } else {
            alert('No se realizaron cambios en el pedido.');
        }
    };

    const savePedido = async () => {
        try {
            if (idPedido !== -1) {
                const payload = {
                    id_pedido: idPedido,
                    id_usuario: userData.id_usuario,
                    id_mesa: mesaInfo.id_mesa,
                    precio_total: precioTotal,
                    total_pagado: totalAPagar
                };
                await updatePedido(payload, ipAddress);
            }
        } catch (error) {
            console.error('Error al actualizar el pedido:', error);
            alert('Hubo un error al actualizar el pedido.');
        }
    };

    const updateDetallePedido = async () => {
        try {
            const payload = {
                oldDetalle: initialDetallePedido,
                newDetalle: productosMesa
            };
            await updateDetallePedidoV2(payload, ipAddress);
            await savePedido();
            await fetchGetMesaInfo();
        } catch (error) {
            console.error('Error al actualizar el detalle del pedido:', error);
            alert('Hubo un error al actualizar el pedido.');
        }
    };

    const handleEliminar = async () => {
        try {
            await dropMesa(mesaInfo.id_mesa, idPedido, ipAddress);
            navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
            });
        } catch (error) {
            console.error('Error al eliminar la mesa:', error);
            alert('Hubo un error al eliminar la mesa.');
        }
    };


    return (
        <View style={styles.container}>
            {/* Contenedor Superior */}
            <View style={styles.upperContainer}>
                {/* Header con el nombre de la mesa y el precio total */}
                <View style={styles.header}>
                    <Text style={styles.headerMesaText}>{mesa}</Text>
                    <Text style={styles.headerPriceText}>{precioTotal.toFixed(2)}€</Text>
                </View>

                {/* Listado de Productos en el Pedido */}
                <ScrollView style={styles.productList}>
                    {productosMesa.map((item) => (
                        <View key={item.id_detalle_pedido} style={isFactura ? styles.productItemFactura : styles.productItem}>
                            {/* Buscar el producto en la lista de productos con base en el id_producto */}
                            {productos
                                .filter((producto) => producto.id_producto === item.id_producto)
                                .map((producto) => (
                                    <View key={producto.id_producto} style={styles.productDetails}>
                                        {/* Contenedor para el nombre y precio */}
                                        <View style={styles.productInfo}>
                                            <Text style={styles.productText}>
                                                {producto.nombre}
                                            </Text>
                                            <Text style={styles.priceText}>
                                                {item.precio_unitario}€
                                            </Text>
                                        </View>

                                        {/* Contenedor para los botones de cantidad */}
                                        <View style={styles.quantityControl}>
                                            <TouchableOpacity
                                                style={styles.quantityButton}
                                                onPress={() => handleDecrement(item.id_producto)}
                                            >
                                                <Text style={styles.quantityButtonText}>-</Text>
                                            </TouchableOpacity>

                                            <Text style={styles.productText}>
                                                {item.cantidad}
                                            </Text>

                                            <TouchableOpacity
                                                style={styles.quantityButton}
                                                onPress={() => handleIncrement(item.id_producto)}
                                            >
                                                <Text style={styles.quantityButtonText}>+</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))}
                        </View>
                    ))}
                </ScrollView>
            </View>

            {/* Contenedor Inferior */}
            <View style={styles.lowerContainer}>
                {/* Listado de Productos en Doble Columna */}
                <ScrollView contentContainerStyle={styles.productGrid}>
                    {productosFiltrados.map((item) => (
                        <TouchableOpacity
                            key={item.id_producto}
                            style={styles.productButton}
                            onPress={() => handleProductoClick(item)}
                        >
                            <Text style={styles.productButtonText}>
                                {item.nombre} - {item.precio}€
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Selector de Tabs (Categorías) */}
            <ScrollView
                horizontal
                style={styles.categoryTabs}
                contentContainerStyle={styles.categoryTabsContainer}
            >
                {categorias.map((categoria) => (
                    <TouchableOpacity
                        key={categoria.id_categoria}
                        style={[
                            styles.categoryTab,
                            categoriaSeleccionada === categoria.id_categoria &&
                            styles.activeCategoryTab
                        ]}
                        onPress={() => setCategoriaSeleccionada(categoria.id_categoria)}
                    >
                        <Text
                            style={[
                                styles.categoryTabText,
                                categoriaSeleccionada === categoria.id_categoria &&
                                styles.activeCategoryTabText
                            ]}
                        >
                            {categoria.nombre}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <TouchableOpacity style={styles.floatingButton3} onPress={handleEliminar}>
                <Text style={styles.floatingButtonText}>🗑️</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.floatingButton2} onPress={handleConfirm}>
                <Text style={styles.floatingButtonText}>💾</Text>
            </TouchableOpacity>

            {/* Botón flotante */}
            <TouchableOpacity style={styles.floatingButton} onPress={handleOpenModal}>
                <Text style={styles.floatingButtonText}>+</Text>
            </TouchableOpacity>

            {/* Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={handleCloseModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Seleccionar Categoría</Text>
                        {loading ? (
                            <ActivityIndicator size="large" color="#0000ff" />
                        ) : (
                            <ScrollView>
                                {categorias.map((item) => (
                                    <TouchableOpacity
                                        key={item.id_categoria}
                                        style={styles.categoryItem}
                                        onPress={() => handleSelectCategoria(item.id_categoria)}
                                    >
                                        <Text style={styles.categoryText}>{item.nombre}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        )}
                        <TouchableOpacity style={styles.closeButton} onPress={handleCloseModal}>
                            <Text style={styles.closeButtonText}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default MesaPage;
