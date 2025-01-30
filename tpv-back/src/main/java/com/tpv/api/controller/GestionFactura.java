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

/**
 * Controlador REST para gestionar la generación de facturas.
 * Proporciona endpoints para obtener facturas por mesas cerradas, fechas específicas o rangos de fechas.
 */
@RestController
@RequestMapping("/api/v1/gestionfactura")
public class GestionFactura {

    @Autowired
    private DetallePedidoServiceImpl detallePedidoService;

    @Autowired
    private MesaServiceImpl mesaService;

    @Autowired
    private PedidoServiceImpl pedidoService;

    @Autowired
    private TransaccionServiceImpl transaccionService;

    @Autowired
    private ProductoServiceImpl productoService;

    /**
     * Obtiene todas las facturas de las mesas cerradas.
     * 
     * @return Lista de facturas con detalles de mesas, pedidos y transacciones.
     */
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

    /**
     * Obtiene las facturas de las mesas cerradas para una fecha específica.
     * 
     * @param fecha Fecha en formato "yyyy-MM-dd".
     * @return Lista de facturas que coinciden con la fecha proporcionada.
     */
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
            if (pedido == null) {
                continue;
            }

            Date fechaPedido = pedido.getFechaPedido();
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            String formattedDate = dateFormat.format(fechaPedido);

            if (!formattedDate.equals(fecha)) {
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

    /**
     * Obtiene las facturas de las mesas cerradas dentro de un rango de fechas.
     * 
     * @param startDate Fecha de inicio en formato "yyyy-MM-dd".
     * @param endDate   Fecha de fin en formato "yyyy-MM-dd".
     * @return Lista de facturas que coinciden con el rango de fechas proporcionado.
     */
    @GetMapping("/getFacturaByFecha/{startDate}/{endDate}")
    public List<MesaInfoResponse> getFacturaByFecha(@PathVariable String startDate, @PathVariable String endDate) {
        List<MesaInfoResponse> entityList = new ArrayList<>();

        List<Mesa> mesas = mesaService.getAllCerrado();
        if (mesas == null || mesas.isEmpty()) {
            return entityList;
        }

        try {
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            Date start = dateFormat.parse(startDate);
            Date end = dateFormat.parse(endDate);

            for (Mesa mesaResponse : mesas) {
                MesaInfoResponse entity = new MesaInfoResponse();
                PedidoResponse pedidoResponse = new PedidoResponse();

                Pedido pedido = pedidoService.getPedidosByMesa(mesaResponse.getIdMesa());
                if (pedido == null) {
                    continue;
                }

                Date fechaPedido = pedido.getFechaPedido();
                if (fechaPedido.before(start) || fechaPedido.after(end)) {
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
        } catch (ParseException e) {
            e.printStackTrace();
        }

        return entityList;
    }
}