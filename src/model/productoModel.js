const constantes = require("../util/constantes");
const productoModel = {};

productoModel.getAll = async (conn) => {
    const queryResponse = await conn.query("SELECT producto.* FROM rrn.tproducto producto", []);
    return queryResponse.rows;
};

productoModel.save = async (conn, productoBean) => {
    const queryResponse = await conn.query("INSERT INTO rrn.tproducto (codigo, nombre, marca, talla, color, precio_venta, estado,"
    +" registrado_por, fecha_registro) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id_producto", 
    [productoBean.codigo, productoBean.nombre, productoBean.marca, productoBean.talla, productoBean.color, productoBean.precio_venta, productoBean.estado,
    productoBean.registrado_por, productoBean.fecha_registro]);
    console.log("productoModel.save queryResponse:", queryResponse);
    return queryResponse.rows;
};

productoModel.updateById = async (conn, productoBean) => {
    const queryResponse = await conn.query("UPDATE rrn.tproducto SET codigo=$1, nombre=$2, marca=$3, talla=$4, color=$5, precio_venta=$6, estado=$7,"
    +" modificado_por=$8, fecha_modificacion=$9 WHERE id_producto=$10", [productoBean.codigo, productoBean.nombre, productoBean.marca, productoBean.talla, productoBean.color, productoBean.precio_venta, 
    productoBean.estado, productoBean.modificado_por, productoBean.fecha_modificacion, productoBean.id_producto]);
    console.log("productoModel.updateById queryResponse:", queryResponse);
    if(queryResponse && queryResponse.rowCount > 0){
        return true;
    }
    return false;
}

module.exports = productoModel;