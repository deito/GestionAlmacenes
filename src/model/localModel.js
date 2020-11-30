const LocalBean = require('../bean/localBean');

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

localModel.getAll = async (conn) => {
    const queryResponse = await conn.query("SELECT local.* FROM rrn.tlocal local",[]);
    const response = [];
    for(let i=0;i < queryResponse.rows.length;i++){
        response.push(extractLocalFromResponse(queryResponse.rows[i]));
    }
    return response;
};

localModel.getById = async (conn, id) => {
    const queryResponse = await conn.query("SELECT local.* FROM rrn.tlocal local WHERE local.id_local=$1",[id]);
    console.log("localModel.getById queryResponse:", queryResponse);
    /*
    const response = [];
    for(let i=0; i<queryResponse.rows.length; i++){
        response.push(extractLocalFromResponse(queryResponse.rows[i]));
    }
    return response;
    */
   return queryResponse.rows;
};

localModel.searchByNombre = async (conn, nombreParam) => {
    const queryResponse = await conn.query("SELECT local.* FROM rrn.tlocal local WHERE UPPER(local.nombre) like '%'||UPPER($1)||'%'",[nombreParam]);
    return queryResponse.rows;
};

localModel.updateEstadoById = async (conn, localBean) => {
    const queryResponse = await conn.query("UPDATE rrn.tlocal SET estado=$1, modificado_por=$2, fecha_modificacion=$3 WHERE id_local=$4",
        [localBean.estado, localBean.modificado_por, localBean.fecha_modificacion, localBean.id_local]);
    console.log("localModel.updateEstadoById queryResponse:", queryResponse);
    if(queryResponse && queryResponse.rowCount > 0){
        return true;
    }
    return false;
};


function extractLocalFromResponse(aRow){
    const id_local = aRow.id_local ? aRow.id_local : null;
    const codigo = aRow.codigo ? aRow.codigo : null;
    const nombre = aRow.nombre ? aRow.nombre : null;
    const telefono = aRow.telefono ? aRow.telefono : null;
    const direccion = aRow.direccion ? aRow.direccion : null;
    const estado = aRow.estado ? aRow.estado : null;
    const registrado_por = aRow.registrado_por ? aRow.registrado_por : null;
    const fecha_registro = aRow.fecha_registro ? aRow.fecha_registro : null;
    const modificado_por = aRow.modificado_por ? aRow.modificado_por : null;
    const fecha_modificacion = aRow.fecha_modificacion ? aRow.fecha_modificacion : null;
    const localBean = new LocalBean(id_local, codigo, nombre, telefono, direccion, estado,
        registrado_por, fecha_registro, modificado_por, fecha_modificacion);
    return localBean;
}

module.exports = localModel;