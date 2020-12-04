module.exports = class TurnoBean {
    constructor(obj){
        obj = obj || {};
        this.id_turno = obj.id_turno;
        this.usuario = obj.usuario;
        this.local = obj.local;
        this.accion = obj.accion;
        this.fecha_inicio = obj.fecha_inicio;
        this.fecha_fin = obj.fecha_fin;
    }
    /*
    setIdTurno(idTurno){
        this.id_turno = idTurno;
    }

    getIdTurno(){
        return this.id_turno;
    }
    */
}