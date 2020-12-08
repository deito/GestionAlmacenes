const ingresoDetalleModel = {};

ingresoDetalleModel.save = async (conn, ingresoDetalleBean) => {
    const queryResponse = await conn.query("INSERT INTO rrn.tingreso_detalle (id_ingreso, id_producto, cantidad)"
    +" VALUES($1, $2, $3) RETURNING id_ingreso_detalle",[ingresoDetalleBean.ingreso.id_ingreso, ingresoDetalleBean.producto.id_producto, ingresoDetalleBean.cantidad]);
    return queryResponse.rows;
};

module.exports = ingresoDetalleModel;