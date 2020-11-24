const productoModel = {};

productoModel.getAll = async (conn) => {
    const queryResponse = await conn.query("SELECT producto.* FROM rrn.tproducto producto", []);
    return queryResponse.rows;
};

module.exports = productoModel;