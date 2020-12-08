module.exports = class IngresoDetalleBean {
    constructor(obj){
        obj = obj || {};
        this.id_ingreso_detalle = obj.id_ingreso_detalle;
        this.ingreso = obj.ingreso;
        this.producto = obj.producto;
        this.cantidad = obj.cantidad;
    }
}