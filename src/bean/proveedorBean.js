module.exports = class ProveedorBean {
    constructor(id_proveedor, tipo_proveedor, tipo_documento, numero_documento, razon_social, telefono, direccion,
        correo, estado, registrado_por, fecha_registro, modificado_por, fecha_modificacion){
        this.id_proveedor = id_proveedor;
        this.tipo_proveedor = tipo_proveedor;
        this.tipo_documento = tipo_documento;
        this.numero_documento = numero_documento;
        this.razon_social = razon_social;
        this.telefono = telefono;
        this.direccion = direccion,
        this.correo = correo;
        this.estado = estado;
        this.registrado_por = registrado_por;
        this.fecha_registro = fecha_registro;
        this.modificado_por = modificado_por;
        this.fecha_modificacion = fecha_modificacion;
    }
}