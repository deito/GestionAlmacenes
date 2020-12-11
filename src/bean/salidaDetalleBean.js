module.exports = class SalidaDetalleBean {
    constructor(obj){
        obj = obj || {};
        this.id_salida_detalle = obj.id_salida_detalle;
        this.salida = obj.salida;
        this.producto = obj.producto;
        this.cantidad = obj.cantidad;
    }
}