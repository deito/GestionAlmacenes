const constantes = require("../util/constantes");
const utility = require('../util/utility');

const salidaModel = {};

salidaModel.save = async (conn, salidaBean) => {
    try {
        const queryResponse = await conn.query("INSERT INTO rrn.tsalida (tipo_salida, fecha_salida, motivo, id_proveedor, descripcion, id_usuario, id_local, registrado_por, fecha_registro)"
        +" VALUES($1, to_timestamp($2,'YYYY-MM-DD'), $3, $4, $5, $6, $7, $8, $9) RETURNING id_salida",[salidaBean.tipo_salida, salidaBean.fecha_salida, salidaBean.motivo, salidaBean.proveedor.id_proveedor, 
        salidaBean.descripcion, salidaBean.usuario.id_usuario, salidaBean.local.id_local, salidaBean.registrado_por, salidaBean.fecha_registro]);
        return queryResponse.rows;
    } catch (error) {
        console.log("Error en salidaModel.save,", error);
        throw error;
    }
};

module.exports = salidaModel;