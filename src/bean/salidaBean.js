module.exports = class SalidaBean {
    constructor(obj){
        this.id_salida = obj.id_salida;
        this.tipo_salida = obj.tipo_salida;
        this.fecha_salida = obj.fecha_salida;
        this.motivo = obj.motivo;
        this.proveedor = obj.proveedor;
        this.descripcion = obj.descripcion;
        this.usuario = obj.usuario;
        this.local = obj.local;
        this.registrado_por = obj.registrado_por;
        this.fecha_registro = obj.fecha_registro;
        this.modificado_por = obj.modificado_por;
        this.fecha_modificacion = obj.fecha_modificacion;
    }
}