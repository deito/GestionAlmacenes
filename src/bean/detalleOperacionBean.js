module.exports = class DetalleOperacionBean {
    constructor(obj){
        obj = obj || {};
        this.id_detalle_operacion = obj.id_detalle_operacion;
        this.operacion = obj.operacion;
        this.producto = obj.producto;
        this.cantidad = obj.cantidad;
        this.precio = obj.precio;
        this.total = obj.total;
    }
}