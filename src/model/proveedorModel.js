const constantes = require("../util/constantes");

const proveedorModel = {};

proveedorModel.getAll = async (conn) => {
    const queryResponse = await conn.query("SELECT proveedor.* FROM rrn.tproveedor proveedor",[]);
    return queryResponse.rows;
};

proveedorModel.save = async (conn, proveedorBean) => {
    const queryResponse = await conn.query("INSERT INTO rrn.tproveedor (tipo_proveedor, tipo_documento, numero_documento, razon_social, telefono, direccion,"
    +" correo, estado, registrado_por, fecha_registro) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id_proveedor",
    [proveedorBean.tipo_proveedor, proveedorBean.tipo_documento, proveedorBean.numero_documento, proveedorBean.razon_social, proveedorBean.telefono,
    proveedorBean.direccion, proveedorBean.correo, proveedorBean.estado, proveedorBean.registrado_por, proveedorBean.fecha_registro]);
    return queryResponse.rows;
};

proveedorModel.getById = async (conn, id) => {
    const queryResponse = await conn.query("SELECT proveedor.* FROM rrn.tproveedor proveedor WHERE proveedor.id_proveedor=$1",[id]);
    return queryResponse.rows;
};

proveedorModel.updateById = async (conn, proveedorBean) => {
    const queryResponse = await conn.query("UPDATE rrn.tproveedor SET tipo_proveedor=$1, tipo_documento=$2, numero_documento=$3, razon_social=$4, telefono=$5, direccion=$6,"
    +" correo=$7, estado=$8, modificado_por=$9, fecha_modificacion=$10 WHERE id_proveedor=$11",
    [proveedorBean.tipo_proveedor, proveedorBean.tipo_documento, proveedorBean.numero_documento, proveedorBean.razon_social, proveedorBean.telefono, proveedorBean.direccion,
    proveedorBean.correo, proveedorBean.estado, proveedorBean.modificado_por, proveedorBean.fecha_modificacion, proveedorBean.id_proveedor]);
    if(queryResponse && queryResponse.rowCount > 0){
        return true;
    }
    return false;
};

proveedorModel.searchByRazonSocialAndTipoProveedor = async (conn, proveedorBean) => {
    let finalquery = "SELECT proveedor.* FROM rrn.tproveedor proveedor";
    let whereCondition = "";
    let queryParameters = [];
    let parameterNames = [];
    if(proveedorBean.razon_social && proveedorBean.razon_social != constantes.emptyString){
        parameterNames.push("razon_social");
    }
    if(proveedorBean.tipo_proveedor){
        parameterNames.push("tipo_proveedor");
    }

    if(parameterNames.length > 0){
        whereCondition = " WHERE";
    }

    for(let i=0;i < parameterNames.length; i++){
        if(i > 0){
            whereCondition = whereCondition + " AND"
        }

        if(parameterNames[i] == "razon_social"){
            whereCondition = whereCondition + " UPPER(proveedor.razon_social) like '%'||UPPER($"+(i+1)+")||'%'";
            queryParameters.push(proveedorBean.razon_social);
        }
        if(parameterNames[i] == "tipo_proveedor"){
            whereCondition = whereCondition + " UPPER(proveedor.tipo_proveedor) like '%'||UPPER($"+(i+1)+")||'%'";
            queryParameters.push(proveedorBean.tipo_proveedor);
        }
    }

    finalquery = finalquery + whereCondition;
    console.log("proveedorModel.searchByRazonSocialAndTipoProveedor finalquery:", finalquery);
    const queryResponse = await conn.query(finalquery, queryParameters);
    return queryResponse.rows;
};

module.exports = proveedorModel;