const ingresoModel = {};

ingresoModel.save = async (conn, ingresoBean) => {
    const queryResponse = await conn.query("INSERT INTO rrn.tingreso (tipo_ingreso, fecha_ingreso, motivo, id_cliente, descripcion, id_usuario, id_local, registrado_por, fecha_registro)"
    +" VALUES($1, to_timestamp($2,'YYYY-MM-DD'), $3, $4, $5, $6, $7, $8, $9) RETURNING id_ingreso",[ingresoBean.tipo_ingreso, ingresoBean.fecha_ingreso, ingresoBean.motivo, ingresoBean.cliente.id_cliente, 
        ingresoBean.descripcion, ingresoBean.usuario.id_usuario, ingresoBean.local.id_local, ingresoBean.registrado_por, ingresoBean.fecha_registro]);
    return queryResponse.rows;
};

ingresoModel.searchByLimitAndOffset = async (conn, cantidad_filas, pagina) => {
    const queryResponse = await conn.query("SELECT ingreso.*, usu.usuario, cliente.razon_social FROM rrn.tingreso ingreso join rrn.tusuario usu on usu.id_usuario=ingreso.id_usuario"
    +" join rrn.tcliente cliente on cliente.id_cliente=ingreso.id_cliente ORDER BY ingreso.id_ingreso"
    +" LIMIT $1 OFFSET $2",[cantidad_filas, cantidad_filas*pagina]);
    return queryResponse.rows;
};

ingresoModel.countRows = async (conn) => {
    const queryResponse = await conn.query("SELECT COUNT(*) as cantidad FROM rrn.tingreso", []);
    return queryResponse.rows;
};

module.exports = ingresoModel;