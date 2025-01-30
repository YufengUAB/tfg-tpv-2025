package com.tpv.api.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tpv.api.entity.DetallePedido;
import com.tpv.api.entity.Mesa;
import com.tpv.api.entity.MesaInfo.MesaInfoResponse;
import com.tpv.api.entity.MesaInfo.PedidoResponse;
import com.tpv.api.entity.Pedido;
import com.tpv.api.entity.Transaccion;
import com.tpv.api.service.DetallePedidoServiceImpl;
import com.tpv.api.service.MesaServiceImpl;
import com.tpv.api.service.PedidoServiceImpl;
import com.tpv.api.service.TransaccionServiceImpl;

/**
 * Controlador REST para gestionar operaciones relacionadas con mesas y pedidos.
 * Expone endpoints para actualizar pedidos, crear mesas y pedidos, eliminar mesas y obtener información de mesas.
 */
@RestController
@RequestMapping("/api/v1/gestionmesa")
public class GestionMesa {

    @Autowired
    private DetallePedidoServiceImpl detallePedidoService;

    @Autowired
    private MesaServiceImpl mesaService;

    @Autowired
    private PedidoServiceImpl pedidoService;

    @Autowired
    private TransaccionServiceImpl transaccionService;

    /**
     * Actualiza los detalles de un pedido comparando los detalles antiguos con los nuevos.
     * 
     * @param request Contiene los detalles antiguos y nuevos del pedido.
     * @return ResponseEntity con un mensaje de éxito o error.
     */
    @PostMapping("/updatePedidoV2")
    public ResponseEntity<String> updatePedidoV2(@RequestBody DetallePedidoUpdateRequest request) {
        DetallePedido[] oldDetallePedido = request.getOldDetalle();
        DetallePedido[] newDetallePedido = request.getNewDetalle();

        try {
            // Eliminar o actualizar detalles antiguos
            for (DetallePedido oldDetalle : oldDetallePedido) {
                boolean found = false;

                for (DetallePedido newDetalle : newDetallePedido) {
                    if (oldDetalle.getIdDetallePedido() == newDetalle.getIdDetallePedido()) {
                        found = true;
                        if (!oldDetalle.equals(newDetalle)) {
                            detallePedidoService.update(newDetalle);
                        }
                        break;
                    }
                }

                if (!found) {
                    detallePedidoService.remove(oldDetalle.getIdDetallePedido());
                }
            }

            // Agregar nuevos detalles
            for (DetallePedido newDetalle : newDetallePedido) {
                boolean exists = false;

                for (DetallePedido oldDetalle : oldDetallePedido) {
                    if (oldDetalle.getIdDetallePedido() == newDetalle.getIdDetallePedido()) {
                        exists = true;
                        break;
                    }
                }

                if (!exists) {
                    detallePedidoService.save(newDetalle);
                }
            }

            return ResponseEntity.ok("Pedido actualizado correctamente");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al actualizar el pedido: " + e.getMessage());
        }
    }

    /**
     * Clase interna para manejar la solicitud de actualización de detalles de pedido.
     */
    public static class DetallePedidoUpdateRequest {
        private DetallePedido[] oldDetalle;
        private DetallePedido[] newDetalle;

        public DetallePedido[] getOldDetalle() {
            return oldDetalle;
        }

        public void setOldDetalle(DetallePedido[] oldDetalle) {
            this.oldDetalle = oldDetalle;
        }

        public DetallePedido[] getNewDetalle() {
            return newDetalle;
        }

        public void setNewDetalle(DetallePedido[] newDetalle) {
            this.newDetalle = newDetalle;
        }
    }

    /**
     * Crea una nueva mesa y un pedido asociado.
     * 
     * @param nMesa    Número de la mesa.
     * @param idUsuario ID del usuario que realiza el pedido.
     * @return El pedido creado.
     */
    @GetMapping("/createMesayPedido/{nMesa}&{idUsuario}")
    public Pedido createMesayPedido(@PathVariable String nMesa, @PathVariable long idUsuario) {
        Mesa newMesa = mesaService.save(new Mesa(nMesa));
        Pedido newPedido = pedidoService.save(new Pedido(idUsuario, newMesa.getIdMesa()));
        return newPedido;
    }

    /**
     * Elimina una mesa y su pedido asociado.
     * 
     * @param idMesa   ID de la mesa a eliminar.
     * @param idPedido ID del pedido a eliminar.
     * @return ResponseEntity con un mensaje de éxito.
     */
    @GetMapping("/dropMesa/{idMesa}&{idPedido}")
    public ResponseEntity<String> dropMesa(@PathVariable long idMesa, @PathVariable long idPedido) {
        detallePedidoService.removeByIdPedido(idPedido);
        pedidoService.remove(idPedido);
        mesaService.remove(idMesa);
        return ResponseEntity.ok("Mesa eliminada correctamente");
    }

    /**
     * Obtiene la información de una mesa específica, incluyendo su pedido y detalles.
     * 
     * @param numero Número de la mesa.
     * @return Información de la mesa y su pedido.
     */
    @GetMapping("/getMesaInfo/{numero}")
    public MesaInfoResponse getMesaInfo(@PathVariable String numero) {
        MesaInfoResponse entity = new MesaInfoResponse();
        PedidoResponse pedidoResponse = new PedidoResponse();

        Mesa mesaResponse = mesaService.findByNumeroMesaAbierta(numero);
        if (mesaResponse == null) {
            return null;
        }

        Pedido pedido = pedidoService.getPedidosByMesa(mesaResponse.getIdMesa());
        Iterable<DetallePedido> detallePedidoResponse = detallePedidoService.findByIdPedido((int) pedido.getIdPedido());
        List<Transaccion> transaccion = transaccionService.findByPedido(pedido.getIdPedido());

        // Calcular el total pagado
        float totalPagado = 0;
        for (Transaccion t : transaccion) {
            totalPagado += t.getTotalPagado();
        }
        pedidoResponse.setTotalPagado(totalPagado);

        // Verificar si todos los detalles del pedido están pagados
        boolean allPaid = true;
        for (DetallePedido dp : detallePedidoResponse) {
            if (dp.getCantidad() != dp.getPagados()) {
                allPaid = false;
                break;
            }
        }

        // Si todos están pagados, cerrar la mesa
        if (allPaid) {
            mesaResponse.setEstado(3);
            mesaService.update(mesaResponse);
        }

        // Configurar la respuesta
        entity.setMesa(mesaResponse);
        pedidoResponse.setIdPedido(pedido.getIdPedido());
        pedidoResponse.setIdUsuario(pedido.getIdUsuario());
        pedidoResponse.setFechaPedido(pedido.getFechaPedido());
        pedidoResponse.setDetallePedido(detallePedidoResponse);
        pedidoResponse.setPrecioTotal(pedido.getPrecioTotal());

        entity.setPedido(pedidoResponse);

        return entity;
    }
}