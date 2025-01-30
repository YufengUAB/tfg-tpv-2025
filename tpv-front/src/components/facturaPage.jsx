import React, { useState, useEffect } from 'react';
import { useUser } from '../context/userContext';
import { useNavigate } from 'react-router-dom';
import '../styles/facturaPage.css';
import { getFacturas, getFacturaByFecha, getFacturaByFechaRange } from '../services/gestionFacturaService';
import { getProductos } from '../services/productoService';

const FacturaPage = () => {
    const { userData } = useUser();
    const navigate = useNavigate();
    const [fechaInicio, setFechaInicio] = useState(new Date().toISOString().split("T")[0]);
    const [fechaFin, setFechaFin] = useState(new Date().toISOString().split("T")[0]);
    const [facturas, setFacturas] = useState([]);
    const [productos, setProductos] = useState([]);
    const [facturaSeleccionada, setFacturaSeleccionada] = useState(null); // Para controlar la fila seleccionada

    // Verifica si el usuario está autenticado y carga los datos iniciales
    useEffect(() => {
        if (!userData) {
            navigate('/login');
        } else {
            fetchProductos();
            fetchPedidosByFecha();
        }
    }, [userData, navigate]);

    // Obtiene todas las facturas
    const fetchPedidos = async () => {
        try {
            const facturas = await getFacturas();
            setFacturas(facturas);
        } catch (error) {
            console.error('Error al obtener los pedidos:', error);
        }
    };

    // Obtiene las facturas por fecha o rango de fechas
    const fetchPedidosByFecha = async () => {
        try {
            const facturas = fechaInicio === fechaFin
                ? await getFacturaByFecha(fechaInicio)
                : await getFacturaByFechaRange(fechaInicio, fechaFin);
            setFacturas(facturas);
        } catch (error) {
            console.error('Error al obtener los pedidos:', error);
        }
    };

    // Actualiza las facturas cuando cambian las fechas
    useEffect(() => {
        fetchPedidosByFecha();
    }, [fechaInicio, fechaFin]);

    // Obtiene todos los productos
    const fetchProductos = async () => {
        try {
            const productos = await getProductos();
            setProductos(productos);
        } catch (error) {
            console.error('Error al obtener los productos:', error);
        }
    };

    // Calcula el total de un pedido
    const calcularTotal = (detallePedido) => {
        return detallePedido.reduce((total, item) => total + item.precio_unitario * item.cantidad, 0);
    };

    // Navega de regreso a la página principal
    const handleBackspace = () => {
        navigate('/main');
    };

    // Maneja el clic en una fila para mostrar/ocultar detalles
    const handleRowClick = (facturaItem) => {
        if (facturaSeleccionada === facturaItem.pedido.idPedido) {
            setFacturaSeleccionada(null); // Deselecciona si ya está seleccionada
        } else {
            setFacturaSeleccionada(facturaItem.pedido.idPedido); // Selecciona la nueva fila
        }
    };

    // Obtiene el nombre de un producto por su ID
    const obtenerNombreProducto = (idProducto) => {
        const producto = productos.find(p => p.id_producto === idProducto);
        return producto ? producto.nombre : 'Producto no encontrado';
    };

    // Genera un informe CSV con las ventas y productos consumidos
    const generarInformeCSV = () => {
        const fechaGeneracion = new Date().toLocaleDateString();

        // Agrupa las facturas por ID de pedido y calcula las ventas totales
        const ventasPorPedido = facturas.reduce((acc, factura) => {
            const idPedido = factura.pedido.idPedido;
            const totalVenta = calcularTotal(factura.pedido.detallePedido);

            if (!acc[idPedido]) {
                acc[idPedido] = {
                    numeroMesa: factura.mesa.numero,
                    productos: [],
                    metodoPago: { efectivo: 0, tarjeta: 0 },
                    totalVenta: 0,
                    fechaPedido: factura.pedido.fechaPedido
                };
            }

            // Agrega productos al pedido
            factura.pedido.detallePedido.forEach(detalle => {
                const nombreProducto = obtenerNombreProducto(detalle.id_producto);
                acc[idPedido].productos.push({
                    nombreProducto,
                    cantidad: detalle.cantidad,
                    precioUnitario: detalle.precio_unitario,
                    totalProducto: (detalle.precio_unitario * detalle.cantidad).toFixed(2)
                });
            });

            // Agrega métodos de pago y suma los totales
            factura.pedido.transaccion.forEach(transaccion => {
                const metodoPago = transaccion.metodo_pago === 1 ? 'efectivo' : 'tarjeta';
                acc[idPedido].metodoPago[metodoPago] += transaccion.total_pagado;
            });

            acc[idPedido].totalVenta += totalVenta;
            return acc;
        }, {});

        // Crea los encabezados del CSV
        const encabezado = ['ID Pedido', 'Fecha Pedido', 'Numero Mesa', 'Productos', 'Metodo de Pago', 'Total Ventas (Euros)'];

        // Crea las filas con los datos de ventas
        const filas = Object.entries(ventasPorPedido).map(([idPedido, datos]) => {
            const productos = datos.productos.map(p => `${p.nombreProducto} (x${p.cantidad})`).join(', ');
            const metodoPago = `Efectivo: ${datos.metodoPago.efectivo.toFixed(2)} Euros, Tarjeta: ${datos.metodoPago.tarjeta.toFixed(2)} Euros`;
            const fechaPedido = new Date(datos.fechaPedido).toLocaleDateString();

            return [
                `"${idPedido}"`,
                `"${fechaPedido}"`,
                `"${datos.numeroMesa}"`,
                `"${productos}"`,
                `"${metodoPago}"`,
                `"${datos.totalVenta.toFixed(2)} Euros"`
            ];
        });

        // Calcula los totales generales
        const totalGeneral = Object.values(ventasPorPedido).reduce((total, datos) => total + datos.totalVenta, 0).toFixed(2);
        const totalEfectivo = Object.values(ventasPorPedido).reduce((total, datos) => total + datos.metodoPago.efectivo, 0).toFixed(2);
        const totalTarjeta = Object.values(ventasPorPedido).reduce((total, datos) => total + datos.metodoPago.tarjeta, 0).toFixed(2);

        // Agrega filas de totales al CSV
        const filaTotal = ['"Total General"', '', '', '', '', `"${totalGeneral} Euros"`];
        const filaTotalesMetodoPago = ['"Total Efectivo"', '', '', '', '', `"${totalEfectivo} Euros"`];
        const filaTotalTarjeta = ['"Total Tarjeta"', '', '', '', '', `"${totalTarjeta} Euros"`];

        // Crea el contenido del CSV
        const csvContent = [
            encabezado.join(';'),
            ...filas.map(row => row.join(';')),
            filaTotal.join(';'),
            filaTotalesMetodoPago.join(';'),
            filaTotalTarjeta.join(';')
        ].join('\n');

        // Agrupa y ordena los productos consumidos
        const productosConsumidos = Object.values(ventasPorPedido).flatMap(datos => datos.productos);
        const productosTotales = productosConsumidos.reduce((acc, producto) => {
            const key = producto.nombreProducto;
            if (!acc[key]) {
                acc[key] = { cantidad: 0 };
            }
            acc[key].cantidad += producto.cantidad;
            return acc;
        }, {});

        const productosOrdenados = Object.entries(productosTotales)
            .sort((a, b) => b[1].cantidad - a[1].cantidad)
            .map(([nombreProducto, datos]) => `"${nombreProducto}"`);

        // Crea la tabla de productos consumidos
        const encabezadoProductos = ['Producto', 'Cantidad'];
        const filasProductos = Object.entries(productosTotales).map(([nombreProducto, datos]) => {
            return [`"${nombreProducto}"`, `"${datos.cantidad}"`];
        });

        const tablaProductosConsumidos = [
            '',
            '',
            encabezadoProductos.join(';'),
            ...filasProductos.map(row => row.join(';'))
        ].join('\n');

        // Combina el contenido del CSV con la tabla de productos
        const csvFinal = [csvContent, tablaProductosConsumidos].join('\n');

        // Crea y descarga el archivo CSV
        const blob = new Blob([csvFinal], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'informe_ventas_por_pedido.csv');
        link.click();
    };

    return (
        <div className="factura-page">
            <div className="factura-header">
                <div>
                    <button className='button-volver-factura' onClick={handleBackspace}>←</button>
                    <span className="factura-title">Facturas</span>
                </div>

                <div className="selector-fecha">
                    <label htmlFor="fechaInicio">Fecha inicio: </label>
                    <input
                        type="date"
                        id="fechaInicio"
                        value={fechaInicio}
                        onChange={(e) => setFechaInicio(e.target.value)}
                    />
                    <label htmlFor="fechaFin">Fecha fin: </label>
                    <input
                        type="date"
                        id="fechaFin"
                        value={fechaFin}
                        onChange={(e) => setFechaFin(e.target.value)}
                    />
                </div>

                <div className="informe-ventas">
                    <button onClick={generarInformeCSV}>Descargar Informe de Ventas</button>
                </div>
            </div>

            <div className="tabla-pedidos">
                {facturas.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Numero Mesa</th>
                                <th>ID Usuario</th>
                                <th>Fecha</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {facturas.map((facturaItem) => (
                                <React.Fragment key={facturaItem.pedido.idPedido}>
                                    <tr onClick={() => handleRowClick(facturaItem)}>
                                        <td>{facturaItem.mesa.numero}</td>
                                        <td>{facturaItem.pedido.idUsuario}</td>
                                        <td>{new Date(facturaItem.pedido.fechaPedido).toLocaleString()}</td>
                                        <td>{calcularTotal(facturaItem.pedido.detallePedido).toFixed(2)} €</td>
                                    </tr>

                                    {facturaSeleccionada === facturaItem.pedido.idPedido && (
                                        <tr>
                                            <td colSpan="4">
                                                <table className="detalle-pedido">
                                                    <thead>
                                                        <tr>
                                                            <th>Producto</th>
                                                            <th>Cantidad</th>
                                                            <th>Precio Unitario</th>
                                                            <th>Total</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {facturaItem.pedido.detallePedido.map((detalle) => (
                                                            <tr key={detalle.id_detalle_pedido}>
                                                                <td>{obtenerNombreProducto(detalle.id_producto)}</td>
                                                                <td>{detalle.cantidad}</td>
                                                                <td>{detalle.precio_unitario.toFixed(2)} €</td>
                                                                <td>{(detalle.precio_unitario * detalle.cantidad).toFixed(2)} €</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                                <table className="detalle-pedido" style={{ marginTop: '10px' }}>
                                                    <thead>
                                                        <tr>
                                                            <th>Metodo pago</th>
                                                            <th>Cantidad</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {facturaItem.pedido.transaccion.map((transaccion) => (
                                                            <tr key={transaccion.id_transaccion}>
                                                                <td>{transaccion.metodo_pago === 1 ? 'Efectivo' : 'Tarjeta'}</td>
                                                                <td>{transaccion.total_pagado}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No hay pedidos para el rango de fechas seleccionado.</p>
                )}
            </div>
        </div>
    );
};

export default FacturaPage;