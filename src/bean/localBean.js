module.exports = class LocalBean {
    constructor(id_local, codigo, nombre, telefono, direccion, estado,
        registrado_por, fecha_registro, modificado_por, fecha_modificacion){
        this.id_local = id_local;
        this.codigo = codigo;
        this.nombre = nombre;
        this.telefono = telefono;
        this.direccion = direccion;
        this.estado = estado;
        this.registrado_por = registrado_por;
        this.fecha_registro = fecha_registro;
        this.modificado_por = modificado_por;
        this.fecha_modificacion = fecha_modificacion;
    }
}