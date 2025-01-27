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

    useEffect(() => {
        if (!userData) {
            navigate('/login');
        } else {
            fetchProductos();
            fetchPedidosByFecha();
        }
    }, [userData, navigate]);

    const fetchPedidos = async () => {
        try {
            const facturas = await getFacturas();
            setFacturas(facturas);
        } catch (error) {
            console.error('Error al obtener los pedidos:', error);
        }
    };

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

    useEffect(() => {
        fetchPedidosByFecha();
    }, [fechaInicio, fechaFin]);

    const fetchProductos = async () => {
        try {
            const productos = await getProductos();
            setProductos(productos);
        } catch (error) {
            console.error('Error al obtener los productos:', error);
        }
    };

    const calcularTotal = (detallePedido) => {
        return detallePedido.reduce((total, item) => total + item.precio_unitario * item.cantidad, 0);
    };

    const handleBackspace = () => {
        navigate('/main');
    };

    // Función para manejar el clic en una fila
    const handleRowClick = (facturaItem) => {
        if (facturaSeleccionada === facturaItem.pedido.idPedido) {
            setFacturaSeleccionada(null); // Si ya está seleccionada, la deseleccionamos
        } else {
            setFacturaSeleccionada(facturaItem.pedido.idPedido); // Seleccionamos la nueva fila
        }
    };

    // Obtener el nombre del producto por id
    const obtenerNombreProducto = (idProducto) => {
        const producto = productos.find(p => p.id_producto === idProducto);
        return producto ? producto.nombre : 'Producto no encontrado';
    };

    const generarInformeCSV = () => {
        // Obtener la fecha actual para el informe
        const fechaGeneracion = new Date().toLocaleDateString();
    
        // Agrupar las facturas por ID de pedido y calcular las ventas totales por pedido
        const ventasPorPedido = facturas.reduce((acc, factura) => {
            const idPedido = factura.pedido.idPedido;
            const totalVenta = calcularTotal(factura.pedido.detallePedido);
    
            if (!acc[idPedido]) {
                acc[idPedido] = {
                    numeroMesa: factura.mesa.numero,
                    productos: [],
                    metodoPago: { efectivo: 0, tarjeta: 0 },
                    totalVenta: 0,
                    fechaPedido: factura.pedido.fechaPedido // Aquí tomamos la fecha del pedido
                };
            }
    
            // Agregar productos al pedido
            factura.pedido.detallePedido.forEach(detalle => {
                const nombreProducto = obtenerNombreProducto(detalle.id_producto);
                acc[idPedido].productos.push({
                    nombreProducto,
                    cantidad: detalle.cantidad,
                    precioUnitario: detalle.precio_unitario,
                    totalProducto: (detalle.precio_unitario * detalle.cantidad).toFixed(2)
                });
            });
    
            // Agregar métodos de pago al pedido y sumar los totales por cada tipo de pago
            factura.pedido.transaccion.forEach(transaccion => {
                const metodoPago = transaccion.metodo_pago === 1 ? 'efectivo' : 'tarjeta';
                acc[idPedido].metodoPago[metodoPago] += transaccion.total_pagado;
            });
    
            // Sumar el total de la venta
            acc[idPedido].totalVenta += totalVenta;
    
            return acc;
        }, {});
    
        // Crear los encabezados del CSV
        const encabezado = ['ID Pedido', 'Fecha Pedido', 'Numero Mesa', 'Productos', 'Metodo de Pago', 'Total Ventas (Euros)'];
    
        // Crear las filas con los datos de ventas por ID de pedido
        const filas = Object.entries(ventasPorPedido).map(([idPedido, datos]) => {
            const productos = datos.productos.map(p => `${p.nombreProducto} (x${p.cantidad})`).join(', ');
            const metodoPago = `Efectivo: ${datos.metodoPago.efectivo.toFixed(2)} Euros, Tarjeta: ${datos.metodoPago.tarjeta.toFixed(2)} Euros`;
    
            // Convertimos la fecha del pedido en formato legible
            const fechaPedido = new Date(datos.fechaPedido).toLocaleDateString();
    
            return [
                `"${idPedido}"`,
                `"${fechaPedido}"`,  // Fecha del pedido
                `"${datos.numeroMesa}"`,
                `"${productos}"`,
                `"${metodoPago}"`,
                `"${datos.totalVenta.toFixed(2)} Euros"`
            ];
        });
    
        // Calcular el total de todos los pedidos
        const totalGeneral = Object.values(ventasPorPedido).reduce((total, datos) => total + datos.totalVenta, 0).toFixed(2);
        const totalEfectivo = Object.values(ventasPorPedido).reduce((total, datos) => total + datos.metodoPago.efectivo, 0).toFixed(2);
        const totalTarjeta = Object.values(ventasPorPedido).reduce((total, datos) => total + datos.metodoPago.tarjeta, 0).toFixed(2);
    
        // Agregar la fila de total general
        const filaTotal = [
            '"Total General"',
            '',
            '',
            '',
            '',
            `"${totalGeneral} Euros"`
        ];
    
        // Agregar la fila de total efectivo y total tarjeta
        const filaTotalesMetodoPago = [
            '"Total Efectivo"',
            '',
            '',
            '',
            '',
            `"${totalEfectivo} Euros"`
        ];
    
        const filaTotalTarjeta = [
            '"Total Tarjeta"',
            '',
            '',
            '',
            '',
            `"${totalTarjeta} Euros"`
        ];
    
        // Unir el encabezado, las filas y las filas de totales utilizando punto y coma como delimitador
        const csvContent = [
            encabezado.join(';'),
            ...filas.map(row => row.join(';')),
            filaTotal.join(';'),
            filaTotalesMetodoPago.join(';'),
            filaTotalTarjeta.join(';')
        ].join('\n');
    
        // Lista de productos consumidos con la cantidad, ordenados de mayor a menor
        const productosConsumidos = Object.values(ventasPorPedido).flatMap(datos => datos.productos);
        
        // Agrupar los productos y calcular las cantidades totales por cada uno
        const productosTotales = productosConsumidos.reduce((acc, producto) => {
            const key = producto.nombreProducto;
            if (!acc[key]) {
                acc[key] = { cantidad: 0 };
            }
            acc[key].cantidad += producto.cantidad;
            return acc;
        }, {});
    
        // Ordenar los productos de mayor a menor según la cantidad
        const productosOrdenados = Object.entries(productosTotales)
            .sort((a, b) => b[1].cantidad - a[1].cantidad)
            .map(([nombreProducto, datos]) => {
                return `"${nombreProducto}"`;  // Mostrar solo el nombre del producto
            });
    
        // Crear la tabla de productos consumidos con encabezado
        const encabezadoProductos = ['Producto', 'Cantidad'];
        const filasProductos = Object.entries(productosTotales).map(([nombreProducto, datos]) => {
            return [`"${nombreProducto}"`, `"${datos.cantidad}"`];  // Mostrar nombre y cantidad de cada producto
        });
    
        // Añadir filas en blanco antes de la tabla
        const tablaProductosConsumidos = [
            '',  // Fila en blanco
            '',  // Fila en blanco
            encabezadoProductos.join(';'),
            ...filasProductos.map(row => row.join(';'))
        ].join('\n');
    
        // Completar el CSV con la tabla de productos consumidos
        const csvFinal = [
            csvContent,
            tablaProductosConsumidos
        ].join('\n');
    
        // Crear un archivo CSV y permitir la descarga con codificación UTF-8
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
                    <button className='button-volver-factura' onClick={handleBackspace}>
                        ←
                    </button>
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
