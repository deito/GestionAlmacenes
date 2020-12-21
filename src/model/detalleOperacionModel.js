const detalleOperacionModel = {};

detalleOperacionModel.save = async (conn, detalleOperacionBean) => {
    try {
        const queryResponse = await conn.query("INSERT INTO rrn.tdetalle_operacion (id_operacion, id_producto, cantidad, precio, total)"
        +" VALUES($1, $2, $3, $4, $5) RETURNING id_detalle_operacion",
        [detalleOperacionBean.operacion.id_operacion, detalleOperacionBean.producto.id_producto, detalleOperacionBean.cantidad, detalleOperacionBean.precio, detalleOperacionBean.total]);
        return queryResponse.rows;
    } catch (error) {
        console.log("Error en detalleOperacionModel.save,", error);
        throw error;
    }
};

module.exports = detalleOperacionModel;