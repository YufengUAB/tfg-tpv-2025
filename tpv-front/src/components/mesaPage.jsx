import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../context/userContext';
import { getCategorias } from '../services/categoriaService';
import { updateDetallePedidoV2, createMesayPedido, dropMesa, getMesaInfo } from '../services/gestionMesaService';
import { getProductos, getProductosPorCategoria } from '../services/productoService';
import '../styles/mesaPage.css';
import { updateMesa } from '../services/mesaService';
import { updatePedido } from '../services/pedidoService';
import { saveTransaccion } from '../services/transaccionService';
import FacturaButton from './factura';
import { toast, ToastContainer } from 'react-toastify';

const MesaPage = () => {
  const { mesa } = useParams();  // Obtiene el ID de la mesa desde la URL
  const { userData } = useUser();  // Obtiene la información del usuario desde el contexto
  const navigate = useNavigate();  // Función para redirigir a otras páginas
  const [inputValue, setInputValue] = useState('');  // Estado para manejar el valor de entrada
  const [categorias, setCategorias] = useState([]);  // Estado para almacenar las categorías de productos
  const [productos, setProductos] = useState([]);  // Estado para almacenar todos los productos
  const [productosPorCategoria, setProductosPorCategoria] = useState([]);  // Estado para almacenar productos por categoría
  const [mesaInfo, setMesaInfo] = useState(null);  // Estado para almacenar la información de la mesa
  const [detallePedido, setDetallePedido] = useState([]);  // Estado para almacenar el detalle del pedido
  const [detallePedidoAPagar, setDetallePedidoAPagar] = useState([]);  // Estado para almacenar los productos a pagar
  const [initialDetallePedido, setInitialDetallePedido] = useState([]);  // Estado para almacenar el detalle inicial del pedido
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);  // Estado para seleccionar la categoría
  const [idPedido, setIdPedido] = useState(-1);  // Estado para el ID del pedido
  const [nuevaMesa, setNuevaMesa] = useState(false);  // Estado para verificar si es una nueva mesa
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);  // Estado para almacenar el producto seleccionado
  const [shouldUpdatePedido, setShouldUpdatePedido] = useState(false);  // Estado para verificar si debe actualizar el pedido
  const [precioTotal, setPrecioTotal] = useState(0);  // Estado para almacenar el precio total del pedido
  const [showModal, setShowModal] = useState(false);  // Estado para manejar la visibilidad del modal
  const [showModalEliminar, setShowModalEliminar] = useState(false);  // Estado para manejar la visibilidad del modal de eliminación
  const [showModalVolver, setShowModalVolver] = useState(false);  // Estado para manejar la visibilidad del modal de volver
  const [totalAPagar, setTotalAPagar] = useState(0);  // Estado para manejar el total a pagar
  const [isFactura, setIsFactura] = useState(false);  // Estado para verificar si es una factura
  const [pagar, setPagar] = useState(false);  // Estado para verificar si se va a realizar el pago
  const [cambio, setCambio] = useState(0);  // Estado para manejar el cambio a devolver

  // Actualiza el precio total del pedido al modificar las cantidades
  useEffect(() => {
    let total = 0;
    for (let i = 0; i < detallePedido.length; i++) {
      let contidadRestante = detallePedido[i].cantidad - detallePedido[i].pagados;
      total += contidadRestante * detallePedido[i].precio_unitario;
    }
    setPrecioTotal(total);
  }, [detallePedido]);

  // Verifica si el usuario está autenticado y obtiene la información necesaria
  useEffect(() => {
    if (!userData) {
      navigate('/login');  // Redirige al login si no hay usuario
    } else {
      fetchCategorias();
      fetchProductos();
      fetchMesaInfo();
    }
  }, [userData, navigate]);

  // Obtiene las categorías disponibles
  const fetchCategorias = async () => {
    try {
      const data = await getCategorias();
      setCategorias(data);
    } catch (error) {
      toast.error('Hubo un error al obtener las categorías.');
    }
  };

  // Obtiene todos los productos disponibles
  const fetchProductos = async () => {
    try {
      const data = await getProductos();
      setProductos(data);
    } catch (error) {
      toast.error('Hubo un error al obtener los productos.');
    }
  };

  // Obtiene la información de la mesa seleccionada
  const fetchMesaInfo = async () => {
    try {
      const data = await getMesaInfo(mesa);
      console.log(data);
      if (data !== "") {
        if (data.mesa.estado === 3) {
          navigate('/main');  // Si la mesa está cerrada, redirige a la página principal
        }

        setMesaInfo(data.mesa);
        setNuevaMesa(false);

        if (data.mesa.estado === 2) {
          setIsFactura(true);  // Si la mesa tiene factura, la marca como factura
        }

        setIdPedido(data.pedido.idPedido);
        setDetallePedido(data.pedido.detallePedido);
        setInitialDetallePedido(data.pedido.detallePedido);

      } else {
        setMesaInfo(mesa);
        setNuevaMesa(true);  // Si no hay información de la mesa, se crea una nueva mesa
      }
    } catch (error) {
      toast.error('Hubo un error al obtener la información de la mesa.');
    }
  };

  // Maneja el clic en una categoría y carga los productos de esa categoría
  const handleCategoriaClick = async (categoria) => {
    setCategoriaSeleccionada(categoria);
    try {
      const data = await getProductosPorCategoria(categoria.id_categoria);
      setProductosPorCategoria(data);
    } catch (error) {
      toast.error('Hubo un error al obtener los productos.');
    }
  };

  // Maneja el clic en un producto, agregando o actualizando el detalle del pedido
  const handleProductoClick = (producto) => {
    const productoExistente = detallePedido.find(
      (detalle) => detalle.id_producto === producto.id_producto
    );

    if (productoExistente) {
      setDetallePedido((prevDetalle) =>
        prevDetalle.map((detalle) =>
          detalle.id_producto === producto.id_producto
            ? { ...detalle, cantidad: detalle.cantidad + 1 }
            : detalle
        )
      );
    } else {
      setDetallePedido((prevDetalle) => [
        ...prevDetalle,
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

  // Maneja el cambio de cantidad de un producto en el detalle del pedido
  const handleCantidadChange = (idProducto, accion) => {
    setDetallePedido((prevDetalle) =>
      prevDetalle.map((detalle) => {
        if (detalle.id_producto === idProducto) {
          const nuevaCantidad = accion === '+' ? detalle.cantidad + 1 : (detalle.cantidad > 1 ? detalle.cantidad - 1 : 1);
          return { ...detalle, cantidad: nuevaCantidad };
        }
        return detalle;
      })
    );
  };

  // Actualiza el detalle del pedido en el backend
  const updateDetallePedido = async () => {
    try {
      const payload = {
        oldDetalle: initialDetallePedido,
        newDetalle: detallePedido
      };
      await updateDetallePedidoV2(payload);
      await savePedido();
      await fetchMesaInfo();
    } catch (error) {
      toast.error('Hubo un error al actualizar el pedido.');
    }
  };

  // Confirma los cambios en el pedido y maneja la creación de la mesa si es nueva
  const handleConfirm = async () => {
    if (JSON.stringify(detallePedido) !== JSON.stringify(initialDetallePedido)) {
      if (nuevaMesa) {
        try {
          const response = await createMesayPedido(mesa, userData.id_usuario);
          setIdPedido(response.id_pedido);
          let mesaNew = {
            id_mesa: response.id_mesa,
          };
          setMesaInfo(mesaNew);
          setNuevaMesa(false);
          const updatedDetallePedido = detallePedido.map(detalle => ({
            ...detalle,
            id_pedido: response.id_pedido,
          }));
          setDetallePedido(updatedDetallePedido);
          setShouldUpdatePedido(true);
        } catch (error) {
          toast.error('Hubo un error al crear la mesa.');
        }
      } else {
        updateDetallePedido();
      }
    }

    setTimeout(() => {
      backToMain();
    }, 0);
  };

  // Ejecuta las actualizaciones pendientes en el pedido
  const executeUpdates = async () => {
    if (shouldUpdatePedido) {
      try {
        await updateDetallePedido();
      } catch (error) {
        toast.error('Hubo un error al actualizar el pedido.');
      } finally {
        setShouldUpdatePedido(false);
      }
    }
  };

  useEffect(() => {
    executeUpdates();
  }, [shouldUpdatePedido]);

  // Guarda el pedido en el backend
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
        await updatePedido(payload);
      }
    } catch (error) {
      toast.error('Hubo un error al actualizar el pedido.');
    }
  };

  // Maneja el clic en "Volver" para regresar a la página principal
  const handleVolver = () => {
    if (JSON.stringify(detallePedido) !== JSON.stringify(initialDetallePedido)) {
      setShowModalVolver(true);
    } else {
      backToMain();
    }
  };

  // Regresa a la página principal
  const backToMain = () => {
    navigate('/main');
  };

  // Elimina la mesa y regresa a la página principal
  const handleEliminar = async () => {
    try {
      await dropMesa(mesaInfo.id_mesa, idPedido);
      navigate('/main');
    } catch (error) {
      toast.error('Hubo un error al eliminar la mesa.');
    }
  };

  // Actualiza el estado de la mesa a "factura" y la marca como facturada
  const handleFactura = () => {
    try {
      mesaInfo.estado = 2;
      updateMesa(mesaInfo);
      setIsFactura(true);
    } catch (error) {
      toast.error('Hubo un error al actualizar la mesa.');
    }
  };


  // Función para manejar el clic en los botones del numpad y agregar su valor al input
  const handleNumpadClick = (value) => {
    setInputValue((prevValue) => prevValue + value);
  };

  // Función para manejar la eliminación del último carácter del input
  const handleBackspace = () => {
    setInputValue((prevValue) => prevValue.slice(0, -1));
  };

  // Función para eliminar el producto seleccionado del detalle del pedido
  const handleRemove = () => {
    if (productoSeleccionado) {
      // Filtra el detallePedido para eliminar el producto seleccionado
      setDetallePedido(detallePedido.filter(detalle => detalle.id_producto !== productoSeleccionado.id_producto));
      setProductoSeleccionado(null); // Resetea la selección de producto
    } else {
      // Si no hay producto seleccionado, muestra un mensaje de error
      toast.error('No hay ningún producto seleccionado para eliminar');
    }
  };

  // Función para seleccionar un producto en el detalle del pedido
  const manejarSeleccionProducto = (detalle) => {
    const producto = productos.find((prod) => prod.id_producto === detalle.id_producto);
    setProductoSeleccionado(producto); // Establece el producto seleccionado
  };

  // Función para cambiar el precio unitario del producto seleccionado
  const handleChange = () => {
    const nuevoPrecioUnitario = parseFloat(inputValue);
    if (isNaN(nuevoPrecioUnitario) || nuevoPrecioUnitario <= 0) {
      toast.error('Por favor, introduce un precio unitario válido');
      return;
    }

    if (productoSeleccionado) {
      // Si hay un producto seleccionado, actualiza su precio unitario
      setDetallePedido(detallePedido.map(detalle =>
        detalle.id_producto === productoSeleccionado.id_producto
          ? { ...detalle, precio_unitario: nuevoPrecioUnitario }
          : detalle
      ));
      setInputValue(''); // Resetea el input
    } else {
      // Si no hay producto seleccionado, muestra un mensaje de error
      toast.error('No hay ningún producto seleccionado para cambiar el precio unitario');
    }
  };

  // Función para alternar el estado de pago y reiniciar los productos pendientes de pago
  const handlePago2 = () => {
    setPagar(!pagar); // Alterna el estado de pago (true/false)
    setDetallePedidoAPagar([]); // Limpia los productos pendientes de pago
    fetchMesaInfo(); // Vuelve a obtener la información de la mesa
  };

  // Función para crear una transacción de pago
  const createTransaccion = async (type, pagado) => {
    try {
      const transaccion = {
        id_pedido: idPedido,
        metodo_pago: type,
        total_pagado: pagado
      };
      await saveTransaccion(transaccion); // Guarda la transacción

      await fetchMesaInfo(); // Vuelve a obtener la información de la mesa
    } catch (error) {
      toast.error('Hubo un error al guardar la transacción.'); // Muestra un mensaje de error si algo falla
    }
  };

  // Función para manejar el método de pago (tarjeta o efectivo)
  const handleMetodoPago = (metodo) => {
    if (detallePedidoAPagar.length > 0) {
      // Si hay productos pendientes de pago
      if (metodo === 'tarjeta') {
        // Si el pago es con tarjeta, crea la transacción
        updateDetallePedido();
        createTransaccion(2, totalAPagar);
        updateDetallePedido();
        setPagar(false); // Finaliza el proceso de pago
      } else if (metodo === 'efectivo') {
        // Si el pago es en efectivo, valida la cantidad ingresada
        if (inputValue !== '' && parseFloat(inputValue) > 0) {
          setShowModal(true); // Muestra el modal de pago en efectivo
          setCambio(parseFloat(inputValue) - totalAPagar); // Calcula el cambio
        } else {
          toast.error('Por favor, introduce un valor válido'); // Muestra un mensaje de error si el valor es inválido
        }
      }
      setInputValue(''); // Resetea el input
    } else {
      toast.error('No hay productos para pagar'); // Muestra un mensaje si no hay productos para pagar
    }
  };

  // Función para llenar el input con el total a pagar
  const handleBotonTodo = () => {
    setInputValue((prevValue) => ((totalAPagar).toFixed(2)).toString()); // Establece el total a pagar en el input
  };

  // Función para mover un producto a la lista de productos pagados
  const handleMoverAPagar = (detalle) => {
    setDetallePedidoAPagar((prevDetallePedidoAPagar) => {
      const existingProduct = prevDetallePedidoAPagar.find(
        (item) => item.id_detalle_pedido === detalle.id_detalle_pedido
      );

      // Si el producto no está en la lista de pagados, lo agrega
      if (!existingProduct) {
        return [
          ...prevDetallePedidoAPagar,
          {
            ...detalle,
            pagados: 1,
          },
        ];
      } else {
        // Si ya está, incrementa el número de veces que ha sido pagado
        return prevDetallePedidoAPagar.map((item) =>
          item.id_detalle_pedido === detalle.id_detalle_pedido
            ? { ...item, pagados: item.pagados + 1 }
            : item
        );
      }
    });

    setDetallePedido((prevDetallePedido) =>
      prevDetallePedido.map((item) =>
        item.id_detalle_pedido === detalle.id_detalle_pedido &&
          item.cantidad > item.pagados
          ? { ...item, pagados: item.pagados + 1 }
          : item
      )
    );
  };

  // Función para mover todos los productos a la lista de productos pagados
  const handleMoverAPagarTodo = () => {
    setDetallePedidoAPagar((prevDetallePedidoAPagar) => {
      const nuevosDetallesAPagar = detallePedido.map((detalle) => {
        const existingProduct = prevDetallePedidoAPagar.find(
          (item) => item.id_detalle_pedido === detalle.id_detalle_pedido
        );

        // Si el producto no está en la lista de pagados, lo agrega con la cantidad completa
        if (!existingProduct) {
          return {
            ...detalle,
            pagados: detalle.cantidad,
          };
        } else {
          // Si ya está, actualiza la cantidad pagada
          return {
            ...existingProduct,
            pagados: existingProduct.pagados + (detalle.cantidad - existingProduct.pagados),
          };
        }
      });

      // Combina los detalles existentes con los nuevos asegurando que no haya duplicados
      const detallesCombinados = [
        ...prevDetallePedidoAPagar.filter(
          (prevItem) =>
            !nuevosDetallesAPagar.some(
              (nuevoItem) => nuevoItem.id_detalle_pedido === prevItem.id_detalle_pedido
            )
        ),
        ...nuevosDetallesAPagar,
      ];

      return detallesCombinados;
    });

    // Marca todos los productos como completamente pagados
    setDetallePedido((prevDetallePedido) =>
      prevDetallePedido.map((item) => ({
        ...item,
        pagados: item.cantidad, // Marca todos los productos como completamente pagados
      }))
    );
  };

  // Función para mover un producto de vuelta a la lista de productos no pagados
  const handleMoverAProductos = (detalle) => {
    setDetallePedidoAPagar((prevDetallePedidoAPagar) =>
      prevDetallePedidoAPagar.map((item) =>
        item.id_detalle_pedido === detalle.id_detalle_pedido && item.pagados > 0
          ? { ...item, pagados: item.pagados - 1 }
          : item
      ).filter(item => item.pagados > 0) // Filtra los productos con pagados > 0
    );

    setDetallePedido((prevDetallePedido) =>
      prevDetallePedido.map((item) =>
        item.id_detalle_pedido === detalle.id_detalle_pedido
          ? { ...item, pagados: item.pagados - 1 }
          : item
      )
    );
  };

  // Función para restablecer todos los productos a su estado no pagado
  const handleMoverAProductosTodo = () => {
    setDetallePedidoAPagar([]); // Vacía la lista de productos pagados

    setDetallePedido((prevDetallePedido) =>
      prevDetallePedido.map((item) => ({
        ...item,
        pagados: 0, // Restablece el campo `pagados` a 0 para todos los productos
      }))
    );
  };

  // Función para cerrar el modal, realizar la transacción y actualizar el detalle del pedido
  const closeModal = () => {
    createTransaccion(1, totalAPagar); // Crea la transacción de pago en efectivo
    setCambio(0); // Resetea el cambio
    updateDetallePedido(); // Actualiza el detalle del pedido
    setPagar(false); // Finaliza el proceso de pago
    setShowModal(false); // Cierra el modal
  };

  return (
    <div className='mesa-page-container'>
      {/* Condicional que verifica si la mesa está en estado de pago */}
      {!pagar ? (
        <div className="mesa-info">
          {/* Condicional para mostrar el estilo dependiendo del estado de la mesa */}
          <div className={mesaInfo && mesaInfo.estado === 2 ? 'mesa-info-container-factura' : 'mesa-info-container'}>
            <div className="mesa-info-header">
              {/* Nombre de la mesa */}
              <span className="mesa-nombre">{mesa}</span>
              {/* Precio total formateado */}
              <span className="mesa-precio-total">{precioTotal.toFixed(2)} €</span>
            </div>

            <div className="tabla-contenedor">
              {/* Tabla con los detalles de los productos en el pedido */}
              <table>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Itera sobre el detalle del pedido */}
                  {detallePedido.map((detalle) => {
                    // Filtra el producto correspondiente a cada detalle
                    const coincidencias = productos.filter(
                      (prod) => prod.id_producto === detalle.id_producto
                    );
                    const producto = coincidencias.length > 0 ? coincidencias[0] : { nombre: 'Nombre no disponible' };

                    // Verifica si el producto está seleccionado
                    const isSelected = productoSeleccionado && productoSeleccionado.id_producto === detalle.id_producto;

                    // Calcula la cantidad restante del producto que no ha sido pagada
                    const cantidadRestante = detalle.cantidad - detalle.pagados;

                    // Si no queda cantidad restante, no muestra el producto
                    if (detalle.cantidad - detalle.pagados <= 0) {
                      return null;
                    }

                    return (
                      <tr
                        key={detalle.id_producto}
                        className={`detalle-pedido-item ${isSelected ? 'selected' : ''}`}
                        onClick={() => manejarSeleccionProducto(detalle)}
                      >
                        {/* Muestra el nombre del producto, cantidad, precio y total */}
                        <td>{producto.nombre}</td>
                        <td>
                          <div className="cantidad-container">
                            {/* Botones para cambiar la cantidad */}
                            <button
                              onClick={() => handleCantidadChange(detalle.id_producto, '-')}
                              className="cantidad-button"
                            >
                              -
                            </button>
                            <div className="cantidad">{cantidadRestante}</div>
                            <button
                              onClick={() => handleCantidadChange(detalle.id_producto, '+')}
                              className="cantidad-button"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td>{detalle.precio_unitario}€</td>
                        <td>{(cantidadRestante * detalle.precio_unitario).toFixed(2)}€</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Condición para mostrar los productos según la categoría seleccionada */}
          {categoriaSeleccionada && (
            <div className="productos-container">
              <div className="productos-grid">
                {productosPorCategoria.map((producto) => (
                  <button
                    key={producto.id_producto}
                    className="producto-button"
                    onClick={() => handleProductoClick(producto)}
                  >
                    {producto.nombre}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        // Sección cuando se encuentra en el modo de pago
        <div className="mesa-info">
          <div className="productos-container-pagar" style={{ marginBottom: '20px' }}>
            <h3>Productos a pagar</h3>
            <div className="productos-grid">
              {/* Botón para mover todos los productos a la sección de productos pagados */}
              <button
                key={`todo`}
                className="producto-button"
                style={{ backgroundColor: 'green' }}
                onClick={() => handleMoverAProductosTodo()}
              >
                Todos los productos
              </button>
              {/* Muestra los productos que ya han sido pagados */}
              {detallePedidoAPagar.map((detalle, index) => {
                const coincidencias = productos.filter(
                  (prod) => prod.id_producto === detalle.id_producto
                );
                const producto = coincidencias.length > 0 ? coincidencias[0] : { nombre: 'Nombre no disponible' };

                return detalle.pagados > 0 ? (
                  <button
                    key={`pagado-${index}`}
                    className="producto-button"
                    onClick={() => handleMoverAProductos(detalle)}
                  >
                    {producto.nombre} x{detalle.pagados}
                  </button>
                ) : null;
              })}
            </div>
          </div>

          {/* Muestra los productos que aún no han sido pagados */}
          <div className="productos-container-pagar">
            <h3>Productos por pagar</h3>
            <div className="productos-grid">
              {/* Botón para mover todos los productos a la sección de productos por pagar */}
              <button
                key={`todo`}
                className="producto-button"
                style={{ backgroundColor: 'green' }}
                onClick={() => handleMoverAPagarTodo()}
              >
                Todos los productos
              </button>
              {/* Muestra los productos que aún no han sido pagados */}
              {detallePedido.map((detalle, index) => {
                const coincidencias = productos.filter(
                  (prod) => prod.id_producto === detalle.id_producto
                );
                const producto = coincidencias.length > 0 ? coincidencias[0] : { nombre: 'Nombre no disponible' };

                const cantidadRestante = detalle.cantidad - detalle.pagados;
                return cantidadRestante > 0 ? (
                  <button
                    key={`producto-${index}`}
                    className="producto-button"
                    onClick={() => handleMoverAPagar(detalle)}
                  >
                    {producto.nombre} x{cantidadRestante}
                  </button>
                ) : null;
              })}
            </div>
          </div>
        </div>
      )}

      <div className="categorias-section">
        {/* Si no está en modo de pago, muestra las categorías */}
        {!pagar ? (
          <div className="categorias-container">
            {categorias.map((categoria) => (
              <div
                key={categoria.id_categoria}
                className="categoria-item"
                onClick={() => handleCategoriaClick(categoria)}
              >
                {categoria.nombre}
              </div>
            ))}
          </div>
        ) : (
          // Muestra el total a pagar en modo pago
          <div className="pago-container">
            <h3>Total a pagar</h3>
            <div className="pago-total">{totalAPagar.toFixed(2)} €</div>
          </div>
        )}
      </div>

      {/* Sección para el teclado numérico */}
      <div className="numpad-section-mesa">
        {/* Modales para mostrar mensajes de confirmación */}
        {showModalVolver && (
          <div className="modal">
            <div className="modal-content">
              <h2>Tienes cambios sin guardar. Salir Igualmente?</h2>
              <button onClick={() => backToMain()}>Confirmar</button>
              <button onClick={() => setShowModalVolver(false)}>Cancelar</button>
            </div>
          </div>
        )}

        {showModalEliminar && (
          <div className="modal">
            <div className="modal-content">
              <h2>Seguro que quieres eliminar la mesa?</h2>
              <button onClick={handleEliminar}>Confirmar</button>
              <button onClick={() => setShowModalEliminar(false)}>Cancelar</button>
            </div>
          </div>
        )}

        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>Cambio Efectivo</h2>
              <h2>{cambio}€</h2>
              <button onClick={closeModal}>Confirmar</button>
            </div>
          </div>
        )}

        {/* Pantalla de entrada para mostrar valores introducidos */}
        <input
          type="text"
          value={inputValue}
          readOnly
          className="numpad-display-mesa"
          placeholder="Introduce un valor"
        />
        <div className="numpad-wrapper-mesa">
          <div className="numbers-grid-mesa">
            {/* Genera los botones del teclado numérico */}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
              <button
                key={number}
                onClick={() => handleNumpadClick(number.toString())}
                className="numpad-button-mesa"
              >
                {number}
              </button>
            ))}
            <button onClick={() => handleNumpadClick('#')} className="numpad-button-mesa">
              #
            </button>
            <button onClick={() => handleNumpadClick('0')} className="numpad-button-mesa">
              0
            </button>
            <button onClick={() => handleNumpadClick('.')} className="numpad-button-mesa">
              .
            </button>

            {/* Si no está en modo de pago, muestra las acciones para eliminar y cambiar */}
            {!pagar && (
              <>
                <button onClick={handleRemove} className="numpad-button-mesa basura-button-mesa">
                  🗑️
                </button>
                <button onClick={handleChange} className="numpad-button-mesa cambio-button-mesa">
                  €
                </button>
              </>
            )}
          </div>

          {/* Si está en modo de pago, muestra las opciones de pago */}
          {pagar ? (
            <div className="actions-grid-mesa">
              <button onClick={handleBackspace} className="numpad-button-mesa action-button-mesa">←</button>
              <button onClick={() => handleMetodoPago('tarjeta')} className='numpad-button-mesa action-button-mesa'>Tarjeta</button>
              <button onClick={() => handleMetodoPago('efectivo')} className='numpad-button-mesa action-button-mesa'>Efectivo</button>
              <button onClick={() => handleBotonTodo()} className='numpad-button-mesa action-button-mesa'>Todo</button>
              <button onClick={handlePago2} className='numpad-button-mesa action-button-mesa'>Cancelar</button>
            </div>
          ) : (
            <div className="actions-grid-mesa">
              {/* Botones de acciones para guardar, volver o eliminar mesa */}
              <button onClick={handleBackspace} className="numpad-button-mesa action-button-mesa">
                ←
              </button>
              <FacturaButton mesa={mesa} precioTotal={precioTotal} detallePedido={detallePedido} handleFactura={handleFactura} />
              {isFactura && (
                <button onClick={handlePago2} className="numpad-button-mesa factura-button-mesa">
                  Pagar
                </button>
              )}
              <button onClick={handleConfirm} className="numpad-button-mesa confirm-button-mesa">
                Guardar
              </button>
              <button onClick={handleVolver} className="numpad-button-mesa confirm-button-mesa">
                Volver
              </button>
              <button onClick={() => setShowModalEliminar(true)} className="numpad-button-mesa action-button-mesa">
                Eliminar
              </button>
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default MesaPage;

