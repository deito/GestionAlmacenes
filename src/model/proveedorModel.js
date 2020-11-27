const proveedorModel = {};

proveedorModel.getAll = async (conn) => {
    const queryResponse = await conn.query("SELECT proveedor.* FROM rrn.tproveedor proveedor",[]);
    return queryResponse.rows;
};

module.exports = proveedorModel;