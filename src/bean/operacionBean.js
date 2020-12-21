module.exports = class OperacionBean {
    constructor(obj){
        obj = obj || {};
        this.id_operacion = obj.id_operacion;
        this.numero_documento = obj.numero_documento;
        this.tipo_documento = obj.tipo_documento;
        this.proveedor = obj.proveedor;
        this.fecha_operacion = obj.fecha_operacion;
        this.usuario = obj.usuario;
        this.local = obj.local;
        this.subtotal = obj.subtotal;
        this.igv = obj.igv;
        this.total = obj.total;
        this.cliente = obj.cliente;
        this.motivo = obj.motivo;
        this.descripcion = obj.descripcion;
        this.tipo_operacion = obj.tipo_operacion;
        this.id_local_origen = obj.id_local_origen;
        this.id_local_destino = obj.id_local_destino;
        this.registrado_por = obj.registrado_por;
        this.fecha_registro = obj.fecha_registro;
        this.modificado_por = obj.modificado_por;
        this.fecha_modificacion = obj.fecha_modificacion;
    }
}