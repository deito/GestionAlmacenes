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

detalleMovimientoModel.getByIdMovimiento = async (conn, id_movimiento) => {
    try {
        const queryResponse = await conn.query("SELECT det_mov.*, producto.codigo as producto_codigo, producto.nombre as producto_nombre FROM rrn.tdetalle_movimiento det_mov"
        +" JOIN rrn.tproducto producto on producto.id_producto=det_mov.id_producto WHERE det_mov.id_movimiento=$1", [id_movimiento]);
        return queryResponse.rows;
    } catch (error) {
        console.log("Error en detalleMovimientoModel.getByIdMovimiento,", error);
        throw error;
    }
};

module.exports = detalleMovimientoModel;