const clienteModel = {};

clienteModel.getAll = async (conn) => {
    const queryResponse = await conn.query("SELECT cliente.* FROM rrn.tcliente cliente",[]);
    return queryResponse.rows;
};

clienteModel.save = async (conn, clienteBean) => {
    const queryResponse = await conn.query("INSERT INTO rrn.tcliente (tipo_cliente, tipo_documento, numero_documento, razon_social, telefono, direccion,"
        +"correo, estado, registrado_por, fecha_registro) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id_cliente",
        [clienteBean.tipo_cliente, clienteBean.tipo_documento, clienteBean.numero_documento, clienteBean.razon_social, clienteBean.telefono, clienteBean.direccion,
        clienteBean.correo, clienteBean.estado, clienteBean.registrado_por, clienteBean.fecha_registro]);
    console.log("clienteModel.save queryResponse:", queryResponse);
    return queryResponse.rows;
};

module.exports = clienteModel;