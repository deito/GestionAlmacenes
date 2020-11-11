const sesionModel = {};

sesionModel.getById = async (conn, id) => {
    const queryResponse = await conn.query("SELECT * FROM rrn.tsesion WHERE id_usuario=$1",[id]); 
    return queryResponse.rows;
};

sesionModel.save = async (conn, sesionBean) => {
    const queryResponse = await conn.query("INSERT INTO rrn.tsesion (id_usuario, token, fecha_expiracion) "
    + " VALUES($1, $2, $3) RETURNING fecha_expiracion", [sesionBean.id_usuario, sesionBean.token, sesionBean.fecha_expiracion]);
    console.log("sesionModel.save queryResponse:", queryResponse);
    return queryResponse.rows;
};

sesionModel.updateById = async (conn, sesionBean) => {
    const queryResponse = await conn.query(
        "UPDATE rrn.tsesion SET token=$1, fecha_expiracion=$2 WHERE id_usuario=$3",
        [sesionBean.token, sesionBean.fecha_expiracion, sesionBean.id_usuario]);
    console.log("sesionModel.updateById queryResponse:", queryResponse);
    if(queryResponse && queryResponse.rowCount == 1){
        return true;
    }
    return false;
};

module.exports = sesionModel;