module.exports = class TipoDocumentoBean {
    constructor(obj){
        obj = obj || {};
        this.id_tipo_documento = obj.id_tipo_documento;
        this.descripcion = obj.descripcion;
        this.estado = obj.estado;
    }
}