module.exports = class MovimientoBean {
    constructor(obj){
        obj = obj || {};
        this.id_movimiento = obj.id_movimiento;
        this.tipo_movimiento = obj.tipo_movimiento;
        this.fecha_movimieto = obj.fecha_movimieto;
        this.operacion = obj.operacion;
        this.local = obj.local;
        this.fecha_registro = obj.fecha_registro;
        this.registrado_por = obj.registrado_por;
        this.fecha_modificacion = obj.fecha_modificacion;
        this.modificado_por = obj.modificado_por;
    }
}