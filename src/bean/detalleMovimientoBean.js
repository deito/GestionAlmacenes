module.exports = class DetalleMovimientoBean{
    constructor(obj){
        obj = obj || {};
        this.id_detalle_movimiento = obj.id_detalle_movimiento;
        this.movimiento = obj.movimiento;
        this.cantidad = obj.cantidad;
        this.producto = obj.producto;
    }
}