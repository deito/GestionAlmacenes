const ingresoDetalleModel = {};

ingresoDetalleModel.save = async (conn, ingresoDetalleBean) => {
    const queryResponse = await conn.query("INSERT INTO rrn.tingreso_detalle (id_ingreso, id_producto, cantidad)"
    +" VALUES($1, $2, $3) RETURNING id_ingreso_detalle",[ingresoDetalleBean.ingreso.id_ingreso, ingresoDetalleBean.producto.id_producto, ingresoDetalleBean.cantidad]);
    return queryResponse.rows;
};

ingresoDetalleModel.getByIdIngreso = async (conn, id_ingreso) => {
    const queryResponse = await conn.query("SELECT ing_det.*, producto.codigo as producto_codigo, producto.nombre as producto_nombre FROM rrn.tingreso_detalle ing_det"
    +" join rrn.tproducto producto on ing_det.id_producto=producto.id_producto WHERE ing_det.id_ingreso=$1",[id_ingreso]);
    return queryResponse.rows;
};

module.exports = ingresoDetalleModel;