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
        const queryResponse = await conn.query("SELECT det_mov.*, producto.codigo as producto_codigo, producto.nombre as producto_nombre"
        +" FROM rrn.tdetalle_movimiento det_mov"
        +" JOIN rrn.tproducto producto on producto.id_producto=det_mov.id_producto WHERE det_mov.id_movimiento=$1", [id_movimiento]);
        return queryResponse.rows;
    } catch (error) {
        console.log("Error en detalleMovimientoModel.getByIdMovimiento,", error);
        throw error;
    }
};

detalleMovimientoModel.getByIdLocalAndIdProducto = async (conn, filters) => {
    try {
        const queryResponse = await conn.query(
        "SELECT tipo_mov.nombre as tipo_movimiento_nombre, movimiento.fecha_movimieto, movimiento.id_local, local.nombre as local_nombre, det_mov.id_producto , producto.nombre as producto_nombre, det_mov.cantidad"
        +" FROM rrn.tmovimiento movimiento"
        +" JOIN rrn.ttipo_movimiento tipo_mov ON tipo_mov.id_tipo_movimiento=movimiento.id_tipo_movimiento"
        +" JOIN rrn.tlocal local ON local.id_local=movimiento.id_local"
        +" JOIN rrn.tdetalle_movimiento det_mov ON det_mov.id_movimiento=movimiento.id_movimiento"
        +" JOIN rrn.tproducto producto ON producto.id_producto=det_mov.id_producto"
        +" WHERE movimiento.id_local=$1 AND det_mov.id_producto=$2 ORDER BY movimiento.fecha_movimieto"
        , [filters.id_local, filters.id_producto]);
        return queryResponse.rows;
    } catch (error) {
        console.log("Error en detalleMovimientoModel.getByIdLocalAndIdProducto,", error);
        throw error;
    }
};

module.exports = detalleMovimientoModel;