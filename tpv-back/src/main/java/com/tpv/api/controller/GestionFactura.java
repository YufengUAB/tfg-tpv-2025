package com.tpv.api.controller;

import java.util.Date;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
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
import com.tpv.api.service.ProductoServiceImpl;
import com.tpv.api.service.TransaccionServiceImpl;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/v1/gestionfactura")
public class GestionFactura {

    @Autowired
    DetallePedidoServiceImpl detallePedidoService;

    @Autowired
    MesaServiceImpl mesaService;

    @Autowired
    PedidoServiceImpl pedidoService;

    @Autowired
    TransaccionServiceImpl transaccionService;

    @Autowired
    ProductoServiceImpl productoService;

    @GetMapping("/getFactura")
    public List<MesaInfoResponse> getFactura() {
        List<MesaInfoResponse> entityList = new ArrayList<>();

        List<Mesa> mesas = mesaService.getAllCerrado();
        if (mesas == null || mesas.isEmpty()) {
            return entityList;
        }

        for (Mesa mesaResponse : mesas) {
            MesaInfoResponse entity = new MesaInfoResponse();
            PedidoResponse pedidoResponse = new PedidoResponse();

            Pedido pedido = pedidoService.getPedidosByMesa(mesaResponse.getIdMesa());
            if (pedido == null) {
                continue;
            }

            Iterable<DetallePedido> detallePedidoResponse = detallePedidoService
                    .findByIdPedido((int) pedido.getIdPedido());
            Iterable<Transaccion> transaccion = transaccionService.findByPedido(pedido.getIdPedido());

            pedidoResponse.setIdPedido(pedido.getIdPedido());
            pedidoResponse.setIdUsuario(pedido.getIdUsuario());
            pedidoResponse.setFechaPedido(pedido.getFechaPedido());
            pedidoResponse.setDetallePedido(detallePedidoResponse);
            pedidoResponse.setTransaccion(transaccion);

            entity.setMesa(mesaResponse);
            entity.setPedido(pedidoResponse);

            entityList.add(entity);
        }

        return entityList;
    }

    @GetMapping("/getFacturaByFecha/{fecha}")
    public List<MesaInfoResponse> getFacturaByFecha(@PathVariable String fecha) {
        List<MesaInfoResponse> entityList = new ArrayList<>();

        List<Mesa> mesas = mesaService.getAllCerrado();
        if (mesas == null || mesas.isEmpty()) {
            return entityList;
        }

        for (Mesa mesaResponse : mesas) {
            MesaInfoResponse entity = new MesaInfoResponse();
            PedidoResponse pedidoResponse = new PedidoResponse();

            Pedido pedido = pedidoService.getPedidosByMesa(mesaResponse.getIdMesa());
            Date fechaPedido = pedido.getFechaPedido();
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            String formattedDate = dateFormat.format(fechaPedido);
            if (pedido == null || !formattedDate.equals(fecha)) {
                continue;
            }

            Iterable<DetallePedido> detallePedidoResponse = detallePedidoService
                    .findByIdPedido((int) pedido.getIdPedido());
            Iterable<Transaccion> transaccion = transaccionService.findByPedido(pedido.getIdPedido());

            pedidoResponse.setIdPedido(pedido.getIdPedido());
            pedidoResponse.setIdUsuario(pedido.getIdUsuario());
            pedidoResponse.setFechaPedido(pedido.getFechaPedido());
            pedidoResponse.setDetallePedido(detallePedidoResponse);
            pedidoResponse.setTransaccion(transaccion);

            entity.setMesa(mesaResponse);
            entity.setPedido(pedidoResponse);

            entityList.add(entity);
        }

        return entityList;
    }

    @GetMapping("/getFacturaByFecha/{startDate}/{endDate}")
    public List<MesaInfoResponse> getFacturaByFecha(@PathVariable String startDate, @PathVariable String endDate) {
        List<MesaInfoResponse> entityList = new ArrayList<>();

        // Obtener las mesas con estado cerrado
        List<Mesa> mesas = mesaService.getAllCerrado();
        if (mesas == null || mesas.isEmpty()) {
            return entityList;
        }

        try {
            // Formateador para convertir las fechas de entrada
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            Date start = dateFormat.parse(startDate);
            Date end = dateFormat.parse(endDate);

            for (Mesa mesaResponse : mesas) {
                MesaInfoResponse entity = new MesaInfoResponse();
                PedidoResponse pedidoResponse = new PedidoResponse();

                Pedido pedido = pedidoService.getPedidosByMesa(mesaResponse.getIdMesa());

                // Verificar si el pedido es nulo o su fecha está fuera del rango
                if (pedido == null) {
                    continue;
                }

                Date fechaPedido = pedido.getFechaPedido();
                if (fechaPedido.before(start) || fechaPedido.after(end)) {
                    continue;
                }

                // Obtener detalles del pedido y transacciones asociadas
                Iterable<DetallePedido> detallePedidoResponse = detallePedidoService
                        .findByIdPedido((int) pedido.getIdPedido());
                Iterable<Transaccion> transaccion = transaccionService.findByPedido(pedido.getIdPedido());

                // Configurar los datos del pedido
                pedidoResponse.setIdPedido(pedido.getIdPedido());
                pedidoResponse.setIdUsuario(pedido.getIdUsuario());
                pedidoResponse.setFechaPedido(pedido.getFechaPedido());
                pedidoResponse.setDetallePedido(detallePedidoResponse);
                pedidoResponse.setTransaccion(transaccion);

                // Configurar los datos de la mesa y agregar a la lista de respuesta
                entity.setMesa(mesaResponse);
                entity.setPedido(pedidoResponse);

                entityList.add(entity);
            }
        } catch (ParseException e) {
            // Manejar errores de formato de fecha
            e.printStackTrace();
        }

        return entityList;
    }
}
