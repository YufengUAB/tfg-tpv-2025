import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getProductos } from '../services/productoService';

const FacturaButton = ({ mesa, precioTotal, detallePedido, handleFactura }) => {
  const [productos, setProductos] = useState([]); // Declaración de productos

  // Función para obtener los productos
  const fetchProductos = async () => {
    try {
      const data = await getProductos();
      setProductos(data);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  };

  // Llamar a fetchProductos al montar el componente
  useEffect(() => {
    fetchProductos();
  }, []);

  // Función para manejar la solicitud de impresión de la factura
  const imprimirFactura = async () => {
    // Generar el objeto de la facturaRequest
    const facturaRequest = {
      mesa: mesa,
      precioTotal: precioTotal,
      detallePedido: detallePedido.map(detalle => {
        // Buscar el producto por su id_producto en el array de productos
        const producto = productos.find(prod => prod.id_producto === detalle.id_producto);
        return {
          nombreProducto: producto ? producto.nombre : 'Producto no encontrado', // Si no se encuentra, colocar un mensaje predeterminado
          cantidad: detalle.cantidad,
          precioUnitario: detalle.precio_unitario,
          total: detalle.cantidad * detalle.precio_unitario,
        };
      }),
    };

    try {
      const response = await axios.post('http://localhost:8080/api/facturas/imprimir', facturaRequest);
      console.log('Factura generada e impresa con éxito:', response.data);
    } catch (error) {
      console.error('Error al generar/imprimir la factura:', error);
    } finally {
      handleFactura(); // Esta línea se ejecutará independientemente de si hay error o no
    }
  };


  return (
    <button onClick={imprimirFactura} className="numpad-button-mesa factura-button-mesa">
      Factura
    </button>
  );
};

export default FacturaButton;
