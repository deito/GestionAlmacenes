const bigDecimal = require('js-big-decimal');
const stockModel = {};

stockModel.getAll = async (conn) => {
    try {
        const queryResponse = await conn.query("SELECT stock.*, producto.codigo as producto_codigo, producto.nombre as producto_nombre, local.nombre as local_nombre"
        +" FROM rrn.tstock stock"
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

stockModel.countRowsByFilters = async (conn, filtros) => {
    try {
        let queryFinal;
        let selectQuery = "SELECT COUNT(*) as cantidad";
        let fromQuery = " FROM rrn.tstock stock"
        let whereCondition = "";
        let queryParameters = [];
        let parameterNames = [];
        if(filtros.id_local){
            parameterNames.push("id_local");
        }
        if(filtros.id_producto){
            parameterNames.push("id_producto");
        }

        if(parameterNames.length > 0){
            whereCondition = " WHERE";
        }

        let i=0;
        for(;i < parameterNames.length;){
            if(i > 0){
                whereCondition = whereCondition + " AND"
            }
            if(parameterNames[i] == "id_local"){
                whereCondition = whereCondition + " stock.id_local=$"+(i+1);
                queryParameters.push(filtros.id_local);
            } else if(parameterNames[i] == "id_producto"){
                whereCondition = whereCondition + " stock.id_producto=$"+(i+1);
                queryParameters.push(filtros.id_producto);
            }
            i = i + 1;
        }
        queryFinal = selectQuery + fromQuery + whereCondition;
        const queryResponse = await conn.query(queryFinal, queryParameters);
        return queryResponse.rows;
    } catch (error) {
        console.log("Error en stockModel.countRowsByFilters,", error);
        throw error;
    }
};

stockModel.searchByFilters = async (conn, filtros) => {
    try {
        let queryFinal;
        let selectQuery = "SELECT stock.*, producto.codigo as producto_codigo, producto.nombre as producto_nombre, local.nombre as local_nombre";
        let fromQuery = " FROM rrn.tstock stock"
        +" join rrn.tproducto producto on producto.id_producto=stock.id_producto"
        +" join rrn.tlocal local on local.id_local=stock.id_local";
        let whereCondition = "";
        let queryParameters = [];
        let parameterNames = [];
        if(filtros.id_local){
            parameterNames.push("id_local");
        }
        if(filtros.id_producto){
            parameterNames.push("id_producto");
        }

        if(parameterNames.length > 0){
            whereCondition = " WHERE";
        }

        let i=0;
        for(;i < parameterNames.length;){
            if(i > 0){
                whereCondition = whereCondition + " AND"
            }
            if(parameterNames[i] == "id_local"){
                whereCondition = whereCondition + " stock.id_local=$"+(i+1);
                queryParameters.push(filtros.id_local);
            } else if(parameterNames[i] == "id_producto"){
                whereCondition = whereCondition + " stock.id_producto=$"+(i+1);
                queryParameters.push(filtros.id_producto);
            }
            i = i + 1;
        }
        queryFinal = selectQuery + fromQuery + whereCondition + " ORDER BY stock.id_stock LIMIT $"+(i+1)+" OFFSET $"+(i+2);
        queryParameters.push(filtros.cantidad_filas);
        let bdCantidadFilas = new bigDecimal(filtros.cantidad_filas);
        let bdParamPaginas = new bigDecimal(filtros.pagina);
        let bdPaginas = bdParamPaginas.subtract(new bigDecimal('1'));
        queryParameters.push(bdCantidadFilas.multiply(bdPaginas).getValue());
        console.log("queryParameters:", queryParameters);
        const queryResponse = await conn.query(queryFinal, queryParameters);
        return queryResponse.rows;
    } catch (error) {
        console.log("Error en stockModel.searchByFilters,", error);
        throw error;
    }
};

module.exports = stockModel;