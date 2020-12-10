const constantes = require("../util/constantes");
const utility = require('../util/utility');

const ingresoModel = {};

ingresoModel.save = async (conn, ingresoBean) => {
    const queryResponse = await conn.query("INSERT INTO rrn.tingreso (tipo_ingreso, fecha_ingreso, motivo, id_cliente, descripcion, id_usuario, id_local, registrado_por, fecha_registro)"
    +" VALUES($1, to_timestamp($2,'YYYY-MM-DD'), $3, $4, $5, $6, $7, $8, $9) RETURNING id_ingreso",[ingresoBean.tipo_ingreso, ingresoBean.fecha_ingreso, ingresoBean.motivo, ingresoBean.cliente.id_cliente, 
        ingresoBean.descripcion, ingresoBean.usuario.id_usuario, ingresoBean.local.id_local, ingresoBean.registrado_por, ingresoBean.fecha_registro]);
    return queryResponse.rows;
};

ingresoModel.searchByLimitAndOffset = async (conn, cantidad_filas, pagina) => {
    const queryResponse = await conn.query("SELECT ingreso.*, usu.usuario, cliente.razon_social, local.nombre as nombre_local"
    +" FROM rrn.tingreso ingreso join rrn.tusuario usu on usu.id_usuario=ingreso.id_usuario"
    +" join rrn.tcliente cliente on cliente.id_cliente=ingreso.id_cliente join rrn.tlocal local on local.id_local=ingreso.id_local ORDER BY ingreso.id_ingreso"
    +" LIMIT $1 OFFSET $2",[cantidad_filas, cantidad_filas*pagina]);
    return queryResponse.rows;
};

ingresoModel.countRows = async (conn) => {
    const queryResponse = await conn.query("SELECT COUNT(*) as cantidad FROM rrn.tingreso", []);
    return queryResponse.rows;
};

ingresoModel.getById = async (conn, id) => {
    const queryResponse = await conn.query("SELECT ingreso.*, usu.usuario, cliente.razon_social, local.nombre as nombre_local"
    +" FROM rrn.tingreso ingreso join rrn.tusuario usu on usu.id_usuario=ingreso.id_usuario"
    +" join rrn.tcliente cliente on cliente.id_cliente=ingreso.id_cliente join rrn.tlocal local on local.id_local=ingreso.id_local WHERE ingreso.id_ingreso=$1",
    [id]);
    return queryResponse.rows;
};

ingresoModel.updateById = async (conn, ingresoBean) => {
    try {
        const queryResponse = await conn.query("UPDATE rrn.tingreso SET tipo_ingreso=$1, fecha_ingreso=to_timestamp($2,'YYYY-MM-DD'), motivo=$3, id_cliente=$4, descripcion=$5,"
        +" id_usuario=$6, id_local=$7, modificado_por=$8, fecha_modificacion=$9 WHERE id_ingreso=$10", 
        [ingresoBean.tipo_ingreso, ingresoBean.fecha_ingreso, ingresoBean.motivo, ingresoBean.cliente.id_cliente, ingresoBean.descripcion,
        ingresoBean.usuario.id_usuario, ingresoBean.local.id_local, ingresoBean.modificado_por, ingresoBean.fecha_modificacion, ingresoBean.id_ingreso]);
        if(queryResponse && queryResponse.rowCount > 0){
            return true;
        }
        return false;
    } catch (error) {
        console.log("Error en ingresoModel.updateById,", error);
        throw error;
    }
};

ingresoModel.countRowsByTipoIngresoAndRangoFecha = async (conn, tipo_ingreso, fecha_inicio, fecha_fin) => {
    try {
        let queryFinal = "SELECT COUNT(*) as cantidad FROM rrn.tingreso ingreso";
        let whereCondition = "";
        let queryParameters = [];
        let parameterNames = [];
        if(tipo_ingreso && tipo_ingreso != constantes.emptyString){
            parameterNames.push("tipo_ingreso");
        }
        if(fecha_inicio && utility.validateStringDateYYYYMMDD(fecha_inicio)){
            parameterNames.push("fecha_inicio");
        }
        if(fecha_fin && utility.validateStringDateYYYYMMDD(fecha_fin)){
            parameterNames.push("fecha_fin");
        }

        if(parameterNames.length > 0){
            whereCondition = " WHERE";
        }
        let i=0;
        for(;i < parameterNames.length;){
            if(i > 0){
                whereCondition = whereCondition + " AND"
            }
            if(parameterNames[i] == "tipo_ingreso"){
                whereCondition = whereCondition + " UPPER(ingreso.tipo_ingreso) LIKE '%'||UPPER($"+(i+1)+")||'%'";
                queryParameters.push(tipo_ingreso);
            }
            if(parameterNames[i] == "fecha_inicio"){
                whereCondition = whereCondition + " ingreso.fecha_ingreso>=TO_TIMESTAMP($"+(i+1)+",'YYYY-MM-DD')";
                queryParameters.push(fecha_inicio);
            }
            if(parameterNames[i] == "fecha_fin"){
                whereCondition = whereCondition + " ingreso.fecha_ingreso<=TO_TIMESTAMP($"+(i+1)+",'YYYY-MM-DD')";
                queryParameters.push(fecha_fin);
            }
            i = i + 1;
        }
        queryFinal = queryFinal + whereCondition;
        //console.log("queryFinal:", queryFinal);
        const queryResponse = await conn.query(queryFinal, queryParameters);
        return queryResponse.rows;
    } catch (error) {
        console.log("Error en ingresoModel.countRowsByTipoIngresoAndRangoFecha,", error);
        throw error;
    }
};

ingresoModel.searchByTipoIngresoAndRangoFechaAndLimitAndOffset = async (conn, tipo_ingreso, fecha_inicio, fecha_fin, cantidad_filas, pagina) => {
    try {
        let queryFinal = "SELECT ingreso.* , usu.usuario, cliente.razon_social, local.nombre as nombre_local FROM rrn.tingreso ingreso"
        +" join rrn.tusuario usu on usu.id_usuario=ingreso.id_usuario"
        +" join rrn.tcliente cliente on cliente.id_cliente=ingreso.id_cliente join rrn.tlocal local on local.id_local=ingreso.id_local";
        let whereCondition = "";
        let queryParameters = [];
        let parameterNames = [];
        if(tipo_ingreso && tipo_ingreso != constantes.emptyString){
            parameterNames.push("tipo_ingreso");
        }
        if(fecha_inicio && utility.validateStringDateYYYYMMDD(fecha_inicio)){
            parameterNames.push("fecha_inicio");
        }
        if(fecha_fin && utility.validateStringDateYYYYMMDD(fecha_fin)){
            parameterNames.push("fecha_fin");
        }

        if(parameterNames.length > 0){
            whereCondition = " WHERE";
        }
        let i=0;
        for(;i < parameterNames.length;){
            if(i > 0){
                whereCondition = whereCondition + " AND"
            }
            if(parameterNames[i] == "tipo_ingreso"){
                whereCondition = whereCondition + " UPPER(ingreso.tipo_ingreso) LIKE '%'||UPPER($"+(i+1)+")||'%'";
                queryParameters.push(tipo_ingreso);
            }
            if(parameterNames[i] == "fecha_inicio"){
                whereCondition = whereCondition + " ingreso.fecha_ingreso>=TO_TIMESTAMP($"+(i+1)+",'YYYY-MM-DD')";
                queryParameters.push(fecha_inicio);
            }
            if(parameterNames[i] == "fecha_fin"){
                whereCondition = whereCondition + " ingreso.fecha_ingreso<=TO_TIMESTAMP($"+(i+1)+",'YYYY-MM-DD')";
                queryParameters.push(fecha_fin);
            }
            i = i + 1;
        }
        queryFinal = queryFinal + whereCondition+" ORDER BY ingreso.id_ingreso LIMIT $"+(i+1)+" OFFSET $"+(i+2);
        queryParameters.push(cantidad_filas);
        queryParameters.push(cantidad_filas*pagina);
        //console.log("queryFinal:", queryFinal);
        const queryResponse = await conn.query(queryFinal, queryParameters);
        return queryResponse.rows;
    } catch (error) {
        console.log("Error en ingresoModel.searchByTipoIngresoAndRangoFechaAndLimitAndOffset,", error);
        throw error;
    }
};

module.exports = ingresoModel;