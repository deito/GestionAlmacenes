module.exports = class IngresoBean {
    constructor(obj){
        obj = obj || {};
        this.id_ingreso = obj.id_ingreso;
        this.tipo_ingreso = obj.tipo_ingreso;
        this.fecha_ingreso = obj.fecha_ingreso;
        this.motivo = obj.motivo;
        this.cliente = obj.cliente;
        this.descripcion = obj.descripcion;
        this.usuario = obj.usuario;
        this.local = obj.local;
        this.registrado_por = obj.registrado_por;
        this.fecha_registro = obj.fecha_registro;
        this.modificado_por = obj.modificado_por;
        this.fecha_modificacion = obj.fecha_modificacion;
    }
}