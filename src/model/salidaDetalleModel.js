const salidaDetalleModel = {};

salidaDetalleModel.save = async (conn, salidaDetalleBean) => {
    try {
        const queryResponse = await conn.query("INSERT INTO rrn.tsalida_detalle (id_salida, id_producto, cantidad) VALUES ($1, $2, $3) RETURNING id_salida_detalle",
        [salidaDetalleBean.salida.id_salida, salidaDetalleBean.producto.id_producto, salidaDetalleBean.cantidad]);
        return queryResponse.rows;
    } catch (error) {
        console.log("Error en salidaDetalleModel.save,", error);
        throw error;
    }
};

module.exports = salidaDetalleModel;