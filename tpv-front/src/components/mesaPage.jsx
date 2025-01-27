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
  const { mesa } = useParams();
  const { userData } = useUser();
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [productosPorCategoria, setProductosPorCategoria] = useState([]);
  const [mesaInfo, setMesaInfo] = useState(null);
  const [detallePedido, setDetallePedido] = useState([]);
  const [detallePedidoAPagar, setDetallePedidoAPagar] = useState([]);
  const [initialDetallePedido, setInitialDetallePedido] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [idPedido, setIdPedido] = useState(-1);
  const [nuevaMesa, setNuevaMesa] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [shouldUpdatePedido, setShouldUpdatePedido] = useState(false);
  const [precioTotal, setPrecioTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showModalEliminar, setShowModalEliminar] = useState(false);
  const [showModalVolver, setShowModalVolver] = useState(false);
  const [totalAPagar, setTotalAPagar] = useState(0);
  const [isFactura, setIsFactura] = useState(false);
  const [pagar, setPagar] = useState(false);
  const [cambio, setCambio] = useState(0);

  useEffect(() => {
    let total = 0;
    for (let i = 0; i < detallePedido.length; i++) {
      let contidadRestante = detallePedido[i].cantidad - detallePedido[i].pagados;
      total += contidadRestante * detallePedido[i].precio_unitario;
    }
    setPrecioTotal(total);
  }, [detallePedido]);


  useEffect(() => {
    if (!userData) {
      navigate('/login');
    } else {
      fetchCategorias();
      fetchProductos();
      fetchMesaInfo();
    }
  }, [userData, navigate]);

  const fetchCategorias = async () => {
    try {
      const data = await getCategorias();
      setCategorias(data);
    } catch (error) {
      toast.error('Hubo un error al obtener las categorías.');
    }
  };

  const fetchProductos = async () => {
    try {
      const data = await getProductos();
      setProductos(data);
    } catch (error) {
      toast.error('Hubo un error al obtener los productos.');
    }
  };

  const fetchMesaInfo = async () => {
    try {
      const data = await getMesaInfo(mesa);
      console.log(data);
      if (data !== "") {
        if (data.mesa.estado === 3) {
          navigate('/main');
        }

        setMesaInfo(data.mesa);
        setNuevaMesa(false);

        if (data.mesa.estado === 2) {
          setIsFactura(true);
        }

        setIdPedido(data.pedido.idPedido);

        setDetallePedido(data.pedido.detallePedido);
        setInitialDetallePedido(data.pedido.detallePedido);

      } else {
        setMesaInfo(mesa);
        setNuevaMesa(true);
      }
    } catch (error) {
      toast.error('Hubo un error al obtener la información de la mesa.');
    }
  };

  const handleCategoriaClick = async (categoria) => {
    setCategoriaSeleccionada(categoria);
    try {
      const data = await getProductosPorCategoria(categoria.id_categoria);
      setProductosPorCategoria(data);
    } catch (error) {
      toast.error('Hubo un error al obtener los productos.');
    }
  };

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

  const handleCantidadChange = (idProducto, accion) => {
    setDetallePedido((prevDetalle) =>
      prevDetalle.map((detalle) => {
        if (detalle.id_producto === idProducto) {
          const nuevaCantidad = accion === '+'
            ? detalle.cantidad + 1
            : (detalle.cantidad > 1 ? detalle.cantidad - 1 : 1);

          return { ...detalle, cantidad: nuevaCantidad };
        }
        return detalle;
      })
    );
  };

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

          setShouldUpdatePedido(prev => {
            return true;
          });
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

  const handleVolver = () => {
    console.log(detallePedido);
    console.log(initialDetallePedido);
    if (JSON.stringify(detallePedido) !== JSON.stringify(initialDetallePedido)) {
      setShowModalVolver(true);
    } else {
      backToMain();
    }

  };

  const backToMain = () => {
    navigate('/main');
  };

  const handleEliminar = async () => {
    try {
      await dropMesa(mesaInfo.id_mesa, idPedido);
      navigate('/main');
    } catch (error) {
      toast.error('Hubo un error al eliminar la mesa.');
    }
  };

  const handleFactura = () => {
    try {
      mesaInfo.estado = 2;
      updateMesa(mesaInfo);
      setIsFactura(true);
    } catch (error) {
      toast.error('Hubo un error al actualizar la mesa.');
    }
  };

  const handleNumpadClick = (value) => {
    setInputValue((prevValue) => prevValue + value);
  };

  const handleBackspace = () => {
    setInputValue((prevValue) => prevValue.slice(0, -1));
  };

  const handleRemove = () => {
    if (productoSeleccionado) {
      setDetallePedido(detallePedido.filter(detalle => detalle.id_producto !== productoSeleccionado.id_producto));
      setProductoSeleccionado(null);
    } else {
      toast.error('No hay ningún producto seleccionado para eliminar');
    }
  };

  const manejarSeleccionProducto = (detalle) => {
    const producto = productos.find((prod) => prod.id_producto === detalle.id_producto);
    setProductoSeleccionado(producto);
  };

  const handleChange = () => {
    const nuevoPrecioUnitario = parseFloat(inputValue);
    if (isNaN(nuevoPrecioUnitario) || nuevoPrecioUnitario <= 0) {
      toast.error('Por favor, introduce un precio unitario válido');
      return;
    }

    if (productoSeleccionado) {
      setDetallePedido(detallePedido.map(detalle =>
        detalle.id_producto === productoSeleccionado.id_producto
          ? { ...detalle, precio_unitario: nuevoPrecioUnitario }
          : detalle
      ));
      setInputValue('');
    } else {
      toast.error('No hay ningún producto seleccionado para cambiar el precio unitario');
    }
  };

  const handlePago2 = () => {
    setPagar(!pagar);
    setDetallePedidoAPagar([]);
    fetchMesaInfo();
  };

  const createTransaccion = async (type, pagado) => {
    try {
      const transaccion = {
        id_pedido: idPedido,
        metodo_pago: type,
        total_pagado: pagado
      };
      await saveTransaccion(transaccion);

      await fetchMesaInfo();
    } catch (error) {
      toast.error('Hubo un error al guardar la transacción.');
    }
  };


  const handleMetodoPago = (metodo) => {
    if (detallePedidoAPagar.length > 0) {
      if (metodo === 'tarjeta') {
        updateDetallePedido();
        createTransaccion(2, totalAPagar);
        updateDetallePedido();
        setPagar(false);
      } else if (metodo === 'efectivo') {
        if (inputValue !== '' && parseFloat(inputValue) > 0) {

          setShowModal(true);
          setCambio(parseFloat(inputValue) - totalAPagar);
        } else {
          toast.error('Por favor, introduce un valor válido');
        }
      }
      setInputValue('');
    } else {
      toast.error('No hay productos para pagar');
    }
  };

  const handleBotonTodo = () => {
    setInputValue((prevValue) => ((totalAPagar).toFixed(2)).toString());
  }

  const handleMoverAPagar = (detalle) => {
    setDetallePedidoAPagar((prevDetallePedidoAPagar) => {
      const existingProduct = prevDetallePedidoAPagar.find(
        (item) => item.id_detalle_pedido === detalle.id_detalle_pedido
      );

      if (!existingProduct) {
        return [
          ...prevDetallePedidoAPagar,
          {
            ...detalle,
            pagados: 1,
          },
        ];
      } else {
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

  const handleMoverAPagarTodo = () => {
    setDetallePedidoAPagar((prevDetallePedidoAPagar) => {
      const nuevosDetallesAPagar = detallePedido.map((detalle) => {
        const existingProduct = prevDetallePedidoAPagar.find(
          (item) => item.id_detalle_pedido === detalle.id_detalle_pedido
        );

        if (!existingProduct) {
          return {
            ...detalle,
            pagados: detalle.cantidad,
          };
        } else {
          return {
            ...existingProduct,
            pagados: existingProduct.pagados + (detalle.cantidad - existingProduct.pagados),
          };
        }
      });

      // Combina los detalles existentes con los nuevos asegurando que no haya duplicados.
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

    setDetallePedido((prevDetallePedido) =>
      prevDetallePedido.map((item) => ({
        ...item,
        pagados: item.cantidad, // Marca todos los productos como completamente pagados.
      }))
    );
  };


  useEffect(() => {
    const total = detallePedidoAPagar.reduce((total, item) => {
      return total + item.pagados * item.precio_unitario;
    }, 0);

    setTotalAPagar(total);
  }, [detallePedidoAPagar]);



  const handleMoverAProductos = (detalle) => {
    setDetallePedidoAPagar((prevDetallePedidoAPagar) =>
      prevDetallePedidoAPagar.map((item) =>
        item.id_detalle_pedido === detalle.id_detalle_pedido && item.pagados > 0
          ? { ...item, pagados: item.pagados - 1 }
          : item
      ).filter(item => item.pagados > 0)
    );

    setDetallePedido((prevDetallePedido) =>
      prevDetallePedido.map((item) =>
        item.id_detalle_pedido === detalle.id_detalle_pedido
          ? { ...item, pagados: item.pagados - 1 }
          : item
      )
    );
  };

  const handleMoverAProductosTodo = () => {
    setDetallePedidoAPagar([]); // Vacía la lista de productos pagados.

    setDetallePedido((prevDetallePedido) =>
      prevDetallePedido.map((item) => ({
        ...item,
        pagados: 0, // Restablece el campo `pagados` a 0 para todos los productos.
      }))
    );
  };


  const closeModal = () => {
    createTransaccion(1, totalAPagar);
    setCambio(0);
    updateDetallePedido();
    setPagar(false);
    setShowModal(false);
  }

  return (
    <div className='mesa-page-container'>
      {!pagar ? (
        <div className="mesa-info">
          <div className={mesaInfo && mesaInfo.estado === 2 ? 'mesa-info-container-factura' : 'mesa-info-container'}>
            <div className="mesa-info-header">
              <span className="mesa-nombre">{mesa}</span>
              <span className="mesa-precio-total">{precioTotal.toFixed(2)} €</span>
            </div>

            <div className="tabla-contenedor">
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
                  {detallePedido.map((detalle) => {
                    const coincidencias = productos.filter(
                      (prod) => prod.id_producto === detalle.id_producto
                    );
                    const producto = coincidencias.length > 0 ? coincidencias[0] : { nombre: 'Nombre no disponible' };
                    const isSelected = productoSeleccionado && productoSeleccionado.id_producto === detalle.id_producto;
                    const cantidadRestante = detalle.cantidad - detalle.pagados;

                    if (detalle.cantidad - detalle.pagados <= 0) {
                      return null;
                    }

                    return (
                      <tr
                        key={detalle.id_producto}
                        className={`detalle-pedido-item ${isSelected ? 'selected' : ''}`}
                        onClick={() => manejarSeleccionProducto(detalle)}
                      >
                        <td>{producto.nombre}</td>
                        <td>
                          <div className="cantidad-container">
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
        <div className="mesa-info">
          <div className="productos-container-pagar" style={{ marginBottom: '20px' }}>
            <h3>Productos a pagar</h3>
            <div className="productos-grid">
              <button
                key={`todo`}
                className="producto-button"
                style={{ backgroundColor: 'green' }}
                onClick={() => handleMoverAProductosTodo()}
              >
                Todos los productos
              </button>
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

          <div className="productos-container-pagar">
            <h3>Productos por pagar</h3>
            <div className="productos-grid">
              <button
                key={`todo`}
                className="producto-button"
                style={{ backgroundColor: 'green' }}
                onClick={() => handleMoverAPagarTodo()}
              >
                Todos los productos
              </button>
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
          <div className="pago-container">
            <h3>Total a pagar</h3>
            <div className="pago-total">{totalAPagar.toFixed(2)} €</div>
          </div>
        )}
      </div>


      <div className="numpad-section-mesa">
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


        <input
          type="text"
          value={inputValue}
          readOnly
          className="numpad-display-mesa"
          placeholder="Introduce un valor"
        />
        <div className="numpad-wrapper-mesa">
          <div className="numbers-grid-mesa">
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

            {!pagar && (
              <><button onClick={handleRemove} className="numpad-button-mesa basura-button-mesa">
                🗑️
              </button>
                <button onClick={handleChange} className="numpad-button-mesa cambio-button-mesa">
                  €
                </button>
              </>
            )}
          </div>


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
