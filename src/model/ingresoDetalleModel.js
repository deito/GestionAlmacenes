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

ingresoDetalleModel.getOnlyThisTableByIdIngreso = async (conn, id_ingreso) => {
    try {
        const queryResponse = await conn.query("SELECT ing_det.* FROM rrn.tingreso_detalle ing_det WHERE ing_det.id_ingreso=$1",[id_ingreso]);
        return queryResponse.rows;
    } catch (error) {
        console.log("Error en ingresoDetalleModel.getOnlyThisTableByIdIngreso,", error);
        throw error;
    }    
};

ingresoDetalleModel.deleteByIdIngreso = async (conn, id_ingreso) => {
    try {
        const queryResponse = await conn.query("DELETE FROM rrn.tingreso_detalle WHERE id_ingreso=$1",[id_ingreso]);
        if(queryResponse && queryResponse.rowCount > 0){
            return true;
        }
        return false;
    } catch (error) {
        console.log("Error en ingresoDetalleModel.deleteById,", error);
        throw error;
    }
};

ingresoDetalleModel.updateById = async (conn, ingresoDetalleBean) => {
    try {
        const queryResponse = await conn.query("UPDATE rrn.tingreso_detalle SET id_producto=$1, cantidad=$2 WHERE id_ingreso_detalle=$3",
        [ingresoDetalleBean.producto.id_producto, ingresoDetalleBean.cantidad, ingresoDetalleBean.id_ingreso_detalle]);
        if(queryResponse && queryResponse.rowCount > 0){
            return true;
        }
        return false;
    } catch (error) {
        console.log("Error en ingresoDetalleModel.updateById,", error);
        throw error;
    }
};

module.exports = ingresoDetalleModel;