module.exports = class SesionBean{
    constructor(id_usuario, token, fecha_expiracion){
        this.id_usuario = id_usuario;
        this.token = token;
        this.fecha_expiracion = fecha_expiracion;
    }
}