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
    //console.log("clienteModel.save queryResponse:", queryResponse);
    return queryResponse.rows;
};

clienteModel.getById = async (conn, id) => {
    const queryResponse = await conn.query("SELECT cliente.* FROM rrn.tcliente cliente WHERE cliente.id_cliente=$1",[id]);
    //console.log("clienteModel.getById queryResponse:", queryResponse);
    return queryResponse.rows;
};

clienteModel.updateById = async (conn, clienteBean) => {
    const queryResponse = await conn.query("UPDATE rrn.tcliente SET tipo_cliente=$1, tipo_documento=$2, numero_documento=$3, razon_social=$4, telefono=$5,"
    +" direccion=$6, correo=$7, estado=$8, modificado_por=$9, fecha_modificacion=$10 WHERE id_cliente=$11",
    [clienteBean.tipo_cliente, clienteBean.tipo_documento, clienteBean.numero_documento, clienteBean.razon_social, clienteBean.telefono, clienteBean.direccion,
    clienteBean.correo, clienteBean.estado, clienteBean.modificado_por, clienteBean.fecha_modificacion, clienteBean.id_cliente]);
    console.log("clienteModel.updateById queryResponse:", queryResponse);
    if(queryResponse && queryResponse.rowCount > 0){
        return true;
    }
    return false;
};

module.exports = clienteModel;