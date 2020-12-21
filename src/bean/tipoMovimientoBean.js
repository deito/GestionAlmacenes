module.exports = class TipoMovimientoBean {
    constructor(obj){
        obj = obj || {};
        this.id_tipo_movimiento = obj.id_tipo_movimiento;
        this.nombre = obj.nombre;
    }
}