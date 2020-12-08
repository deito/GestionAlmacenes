const ingresoModel = {};

ingresoModel.save = async (conn, ingresoBean) => {
    const queryResponse = await conn.query("INSERT INTO rrn.tingreso (tipo_ingreso, fecha_ingreso, motivo, id_cliente, descripcion, id_usuario, id_local, registrado_por, fecha_registro)"
    +" VALUES($1, to_timestamp($2,'YYYY-MM-DD'), $3, $4, $5, $6, $7, $8, $9) RETURNING id_ingreso",[ingresoBean.tipo_ingreso, ingresoBean.fecha_ingreso, ingresoBean.motivo, ingresoBean.id_cliente, 
        ingresoBean.descripcion, ingresoBean.id_usuario, ingresoBean.id_local, ingresoBean.registrado_por, ingresoBean.fecha_registro]);
    return queryResponse.rows;
};

module.exports = ingresoModel;