const movimientoModel = {};

movimientoModel.save = async (conn, movimientoBean) => {
    try {
        const queryResponse = await conn.query("INSERT INTO rrn.tmovimiento (id_tipo_movimiento, fecha_movimieto, id_operacion, id_local, fecha_registro, registrado_por)"
        +" VALUES($1, to_timestamp($2,'YYYY-MM-DD'), $3, $4, NOW(), $5) RETURNING id_movimiento",
        [movimientoBean.tipo_movimiento.id_tipo_movimiento, movimientoBean.fecha_movimieto, movimientoBean.operacion.id_operacion, movimientoBean.local.id_local,
        movimientoBean.registrado_por]);
        return queryResponse.rows;
    } catch (error) {
        console.log("Error en movimientoModel.save,", error);
        throw error;
    }
};

module.exports = movimientoModel;