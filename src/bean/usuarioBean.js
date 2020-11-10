module.exports = class UsuarioBean {
    constructor(id_usuario, id_local, nombres, apellidos, usuario, contrasena, rol, tipo_documento, numero_documento, telefono, estado,
        registrado_por, fecha_registro, modificado_por, fecha_modificacion){
        this.id_usuario = id_usuario;
        this.id_local = id_local;
        this.nombres = nombres;
        this.apellidos = apellidos;
        this.usuario = usuario;
        this.contrasena = contrasena;
        this.rol = rol;
        this.tipo_documento = tipo_documento;
        this.numero_documento = numero_documento,
        this.telefono = telefono,
        this.estado = estado,
        this.registrado_por = registrado_por,
        this.fecha_registro = fecha_registro,
        this.modificado_por = modificado_por,
        this.fecha_modificacion = fecha_modificacion
    }
}