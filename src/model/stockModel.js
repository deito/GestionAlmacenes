const stockModel = {};

stockModel.getAll = async (conn) => {
    try {
        const queryResponse = await conn.query("SELECT stock.*, producto.codigo as producto_codigo, producto.nombre as producto_nombre,"
        +" local.nombre as local_nombre FROM rrn.tstock stock"
        +" join rrn.tproducto producto on producto.id_producto=stock.id_producto"
        +" join rrn.tlocal local on local.id_local=stock.id_local",[]);
        return queryResponse.rows;
    } catch (error) {
        console.log("Error en stockModel.getAll,", error);
        throw error;
    }
};

stockModel.getByIdProductoAndIdLocal = async (conn, id_producto, id_local) => {
    try {
        const queryResponse = await conn.query("SELECT stock.* FROM rrn.tstock stock WHERE stock.id_producto=$1 AND stock.id_local=$2",
        [id_producto, id_local]);
        return queryResponse.rows;
    } catch (error) {
        console.log("Error en stockModel.getByIdProductoAndIdLocal,", error);
        throw error;
    }
};

stockModel.save = async (conn, stockBean) => {
    try {
        const queryResponse = await conn.query("INSERT INTO rrn.tstock (id_producto, id_local, cantidad)"
        +" VALUES($1, $2, $3) RETURNING id_stock",[stockBean.producto.id_producto, stockBean.local.id_local, stockBean.cantidad]);
        return queryResponse.rows;
    } catch (error) {
        console.log("Error en stockModel.save,", error);
        throw error;
    }
};

stockModel.updateCantidadById = async (conn, stockBean) => {
    try {
        const queryResponse = await conn.query("UPDATE rrn.tstock SET cantidad=$1 WHERE id_stock=$2",
        [stockBean.cantidad, stockBean.id_stock]);
        if(queryResponse && queryResponse.rowCount > 0){
            return true;
        }
        return false;
    } catch (error) {
        console.log("Error en stockModel.updateCantidadById,", error);
        throw error;
    }
};

module.exports = stockModel;