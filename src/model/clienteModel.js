const clienteModel = {};

clienteModel.getAll = async (conn) => {
    const queryResponse = await conn.query("SELECT cliente.* FROM rrn.tcliente cliente",[]);
    return queryResponse.rows;
};

module.exports = clienteModel;