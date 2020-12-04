const turnoModel = {};

turnoModel.searchLastTurnoByIdUsuarioAndIdLocal = async (conn, id_usuario, id_local) => {
    const queryResponse = await conn.query("SELECT * FROM (SELECT max(turno.id_turno) as id_turno_max FROM rrn.tturno turno WHERE id_usuario=$1 and id_local=$2) turno_aux"
    +" join rrn.tturno turno on turno_aux.id_turno_max=turno.id_turno",[id_usuario, id_local]);
    return queryResponse.rows;
};

module.exports = turnoModel;