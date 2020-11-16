const localModel = {};

localModel.save = async (conn, localBean) => {
    const queryResponse = await conn.query("INSERT INTO rrn.tlocal (codigo, nombre, telefono, direccion, estado,"
        +" registrado_por, fecha_registro) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id_local",
        [localBean.codigo, localBean.nombre, localBean.telefono, localBean.direccion, localBean.estado, 
        localBean.registrado_por, localBean.fecha_registro]);
    console.log("localModel.save queryResponse:", queryResponse);
    return queryResponse.rows;
};

localModel.updateById = async (conn, localBean) => {
    const queryResponse =  await conn.query("UPDATE rrn.tlocal SET codigo=$1, nombre=$2, telefono=$3, direccion=$4,"
    +" estado=$5, modificado_por=$6, fecha_modificacion=$7 WHERE id_local=$8",
    [localBean.codigo, localBean.nombre, localBean.telefono, localBean.direccion,
    localBean.estado, localBean.modificado_por, localBean.fecha_modificacion, localBean.id_local]);
    console.log("localModel.updateById queryResponse:", queryResponse);
    if(queryResponse && queryResponse.rowCount == 1){
        return true;
    }
    return false;
};

module.exports = localModel;