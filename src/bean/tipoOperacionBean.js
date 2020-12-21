module.exports = class TipoOperacionBean {
    constructor(obj){
        obj = obj || {};
        this.id_tipo_operacion = obj.id_tipo_operacion;
        this.nombre = obj.nombre;
        this.id_tipo_movimiento = obj.id_tipo_movimiento;
    }
}