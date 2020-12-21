const detalleMovimientoModel = {};

detalleMovimientoModel.save = async (conn, detalleMovimientBean) => {
    try {
        const queryResponse = await conn.query("INSERT INTO rrn.tdetalle_movimiento (id_movimiento, cantidad, id_producto) VALUES ($1, $2, $3) RETURNING id_detalle_movimiento",
        [detalleMovimientBean.movimiento.id_movimiento, detalleMovimientBean.cantidad, detalleMovimientBean.producto.id_producto]);
        return queryResponse.rows;
    } catch (error) {
        console.log("Error en detalleMovimientoModel.save,", error);
        throw error;
    }
};

module.exports = detalleMovimientoModel;