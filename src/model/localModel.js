const localModel = {};

localModel.save = async (conn, localBean) => {
    const queryResponse = await conn.query("INSERT INTO rrn.tlocal (codigo, nombre, telefono, direccion, estado,"
        +" registrado_por, fecha_registro) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id_local",
        [localBean.codigo, localBean.nombre, localBean.telefono, localBean.direccion, localBean.estado, 
        localBean.registrado_por, localBean.fecha_registro]);
    console.log("localModel.save queryResponse:", queryResponse);
    return queryResponse.rows;
};

module.exports = localModel;