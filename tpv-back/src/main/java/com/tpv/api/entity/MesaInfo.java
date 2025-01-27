package com.tpv.api.entity;

import java.util.Date;

public class MesaInfo {

    public static class MesaInfoResponse {
        private Mesa mesa;
        private PedidoResponse pedido;

        public MesaInfoResponse() {}

        public Mesa getMesa() {
            return mesa;
        }
        public void setMesa(Mesa mesa) {
            this.mesa = mesa;
        }

        public PedidoResponse getPedido() {
            return pedido;
        }
        public void setPedido(PedidoResponse pedido) {
            this.pedido = pedido;
        }

    }

    public static class PedidoResponse {
        private long idPedido;
        private long idUsuario;
        private Date fechaPedido;
        private float precioTotal;
        private float totalPagado;
        private Iterable<DetallePedido> detallePedido;
        private Iterable<Transaccion> transaccion;

        public PedidoResponse() {}

        public long getIdPedido() {
            return idPedido;
        }
        public void setIdPedido(long idPedido) {
            this.idPedido = idPedido;
        }

        public long getIdUsuario() {
            return idUsuario;
        }
        public void setIdUsuario(long idUsuario) {
            this.idUsuario = idUsuario;
        }

        public Date getFechaPedido() {
            return fechaPedido;
        }
        public void setFechaPedido(Date fechaPedido) {
            this.fechaPedido = fechaPedido;
        }

        public Iterable<DetallePedido> getDetallePedido() {
            return detallePedido;
        }
        public void setDetallePedido(Iterable<DetallePedido> detallePedido) {
            this.detallePedido = detallePedido;
        }

        public float getPrecioTotal() {
            return precioTotal;
        }
        public void setPrecioTotal(float precioTotal) {
            this.precioTotal = precioTotal;
        }

        public float getTotalPagado() {
            return totalPagado;
        }
        public void setTotalPagado(float totalPagado) {
            this.totalPagado = totalPagado;
        }

        public Iterable<Transaccion> getTransaccion() {
            return transaccion;
        }
        public void setTransaccion(Iterable<Transaccion> transaccion) {
            this.transaccion = transaccion;
        }
        
    }

}
