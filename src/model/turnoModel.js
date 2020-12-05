const turnoModel = {};

turnoModel.searchLastTurnoByIdUsuarioAndIdLocal = async (conn, id_usuario, id_local) => {
    const queryResponse = await conn.query("SELECT * FROM (SELECT max(turno.id_turno) as id_turno_max FROM rrn.tturno turno WHERE id_usuario=$1 and id_local=$2) turno_aux"
    +" join rrn.tturno turno on turno_aux.id_turno_max=turno.id_turno",[id_usuario, id_local]);
    return queryResponse.rows;
};

turnoModel.save = async (conn, turnoBean) => {
    const queryResponse = await conn.query("INSERT INTO rrn.tturno (id_usuario, id_local, accion, fecha_inicio) VALUES($1, $2, $3, $4) RETURNING id_turno", 
        [turnoBean.usuario.id_usuario, turnoBean.local.id_local, turnoBean.accion, turnoBean.fecha_inicio]);
    return queryResponse.rows;
};

turnoModel.updateAccionAndFechaFinByIdTurno = async (conn, turnoBean) => {
    const queryResponse = await conn.query("UPDATE rrn.tturno SET accion=$1, fecha_fin=$2 WHERE id_turno=$3", 
        [turnoBean.accion, turnoBean.fecha_fin, turnoBean.id_turno]);
    if(queryResponse && queryResponse.rowCount > 0){
        return true;
    }
    return false;
};

module.exports = turnoModel;