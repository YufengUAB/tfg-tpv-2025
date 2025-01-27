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

@RestController
@RequestMapping("/api/v1/gestionmesa")
public class GestionMesa {

    @Autowired
    DetallePedidoServiceImpl detallePedidoService;

    @Autowired
    MesaServiceImpl mesaService;

    @Autowired
    PedidoServiceImpl pedidoService;

    @Autowired
    TransaccionServiceImpl transaccionService;

    @PostMapping("/updatePedidoV2")
    public ResponseEntity<String> updatePedidoV2(@RequestBody DetallePedidoUpdateRequest request) {
        DetallePedido[] oldDetallePedido = request.getOldDetalle();
        DetallePedido[] newDetallePedido = request.getNewDetalle();

        try {
            for (DetallePedido oldDetalle : oldDetallePedido) {
                boolean found = false;

                for (DetallePedido newDetalle : newDetallePedido) {
                    if (oldDetalle.getIdDetallePedido() == newDetalle.getIdDetallePedido()) {
                        found = true;
                        // Si el detalle ha cambiado, actualizarlo
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

            for (DetallePedido newDetalle : newDetallePedido) {
                boolean exists = false;

                for (DetallePedido oldDetalle : oldDetallePedido) {
                    if (oldDetalle.getIdDetallePedido() == newDetalle.getIdDetallePedido()) {
                        exists = true;
                        break;
                    }
                }
                System.out.println("exists: " + exists);
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

    @GetMapping("/createMesayPedido/{nMesa}&{idUsuario}")
    public Pedido createMesayPedido(@PathVariable String nMesa, @PathVariable long idUsuario) {
        Mesa newMesa = mesaService.save(new Mesa(nMesa));
        System.out.println("newMesa: " + newMesa.getIdMesa());
        Pedido newPedido = pedidoService.save(new Pedido(idUsuario, newMesa.getIdMesa()));
        System.out.println("newPedido: " + newPedido.getIdMesa());
        return newPedido;
    }

    @GetMapping("/dropMesa/{idMesa}&{idPedido}")
    public ResponseEntity<String> dropMesa(@PathVariable long idMesa, @PathVariable long idPedido) {
        detallePedidoService.removeByIdPedido(idPedido);
        pedidoService.remove(idPedido);
        mesaService.remove(idMesa);
        return ResponseEntity.ok("Mesa eliminada correctamente");
    }

    @GetMapping("/getMesaInfo/{numero}")
    public MesaInfoResponse postMethodName(@PathVariable String numero) {
        MesaInfoResponse entity = new MesaInfoResponse();
        PedidoResponse pedidoResponse = new PedidoResponse();

        Mesa mesaResponse = mesaService.findByNumeroMesaAbierta(numero);
        System.out.println("mesaResponse: " + mesaResponse);
        if (mesaResponse == null) {
            return null;
        }
        Pedido pedido = pedidoService.getPedidosByMesa(mesaResponse.getIdMesa());
        Iterable<DetallePedido> detallePedidoResponse = detallePedidoService.findByIdPedido((int) pedido.getIdPedido());

        List<Transaccion> transaccion = transaccionService.findByPedido(pedido.getIdPedido());

        if (transaccion.isEmpty()) {
            pedidoResponse.setTotalPagado(0);
        } else {
            float totalPagado = 0;
            for (Transaccion t : transaccion) {
                totalPagado += t.getTotalPagado();
            }
            pedidoResponse.setTotalPagado(totalPagado);
        }
        pedidoResponse.setPrecioTotal(pedido.getPrecioTotal());

        boolean allPaid = true; 

        for (DetallePedido dp : detallePedidoResponse) {
            if (dp.getCantidad() != dp.getPagados()) {
                allPaid = false; 
                break; 
            }
        }

        if (allPaid) {
            mesaResponse.setEstado(3);
            mesaService.update(mesaResponse);
        }

        entity.setMesa(mesaResponse);

        pedidoResponse.setIdPedido(pedido.getIdPedido());
        pedidoResponse.setIdUsuario(pedido.getIdUsuario());
        pedidoResponse.setFechaPedido(pedido.getFechaPedido());
        pedidoResponse.setDetallePedido(detallePedidoResponse);

        entity.setPedido(pedidoResponse);

        return entity;
    }

}
