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

module.exports = proveedorModel;