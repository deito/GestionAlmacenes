const constantes = require("../util/constantes");
const utility = require('../util/utility');

const operacionModel = {};

operacionModel.save = async (conn, operacionBean) => {
    try {
        const queryResponse = await conn.query("INSERT INTO rrn.toperacion (numero_documento, id_tipo_documento, id_proveedor, fecha_operacion, id_usuario, id_local, subtotal, igv, total, id_cliente, motivo, descripcion, id_tipo_operacion, id_local_origen, id_local_destino, registrado_por, fecha_registro)"
        +" VALUES($1, $2, $3, to_timestamp($4,'YYYY-MM-DD'), $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NOW()) RETURNING id_operacion",
        [operacionBean.numero_documento, operacionBean.tipo_documento.id_tipo_documento, operacionBean.proveedor.id_proveedor, operacionBean.fecha_operacion, operacionBean.usuario.id_usuario, operacionBean.local.id_local, operacionBean.subtotal, operacionBean.igv, operacionBean.total, operacionBean.cliente.id_cliente,
        operacionBean.motivo, operacionBean.descripcion, operacionBean.tipo_operacion.id_tipo_operacion, operacionBean.id_local_origen, operacionBean.id_local_destino, operacionBean.registrado_por]);
        return queryResponse.rows;
    } catch (error) {
        console.log("Error en operacionModel.save,", error);
        throw error;
    }
};

module.exports = operacionModel;