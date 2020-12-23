const bigDecimal = require('js-big-decimal');
const constantes = require("../util/constantes");
const utility = require('../util/utility');

const operacionModel = {};

operacionModel.save = async (conn, operacionBean) => {
    try {
        const queryResponse = await conn.query("INSERT INTO rrn.toperacion (numero_documento, id_tipo_documento, id_proveedor, fecha_operacion, id_usuario, id_local, subtotal, igv, total, id_cliente, motivo, descripcion, id_tipo_operacion, id_local_origen, id_local_destino, registrado_por, fecha_registro)"
        +" VALUES($1, $2, $3, to_timestamp($4,'YYYY-MM-DD'), $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, NOW()) RETURNING id_operacion",
        [operacionBean.numero_documento, operacionBean.tipo_documento.id_tipo_documento, operacionBean.proveedor.id_proveedor, operacionBean.fecha_operacion, operacionBean.usuario.id_usuario, operacionBean.local.id_local, operacionBean.subtotal, operacionBean.igv, operacionBean.total, operacionBean.cliente.id_cliente,
        operacionBean.motivo, operacionBean.descripcion, operacionBean.tipo_operacion.id_tipo_operacion, operacionBean.id_local_origen, operacionBean.id_local_destino, operacionBean.registrado_por]);
        return queryResponse.rows;
    } catch (error) {
        console.log("Error en operacionModel.save,", error);
        throw error;
    }
};

operacionModel.countRowsByFilters = async (conn, filtros) => {
    try {
        let queryFinal = "SELECT COUNT(*) as cantidad FROM rrn.toperacion operacion";
        let whereCondition = "";
        let queryParameters = [];
        let parameterNames = [];
        if(filtros.id_tipo_operacion){
            parameterNames.push("id_tipo_operacion");
        }
        if(filtros.id_tipo_documento){
            parameterNames.push("id_tipo_documento");
        }
        if(filtros.id_cliente){
            parameterNames.push("id_cliente");
        }
        if(filtros.fecha_inicio){
            parameterNames.push("fecha_inicio");
        }
        if(filtros.fecha_fin){
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
            if(parameterNames[i] == "id_tipo_operacion"){
                whereCondition = whereCondition + " operacion.id_tipo_operacion=$"+(i+1);
                queryParameters.push(filtros.id_tipo_operacion);
            } else if(parameterNames[i] == "id_tipo_documento"){
                whereCondition = whereCondition + " operacion.id_tipo_documento=$"+(i+1);
                queryParameters.push(filtros.id_tipo_documento);
            } else if(parameterNames[i] == "id_cliente"){
                whereCondition = whereCondition + " operacion.id_cliente=$"+(i+1);
                queryParameters.push(filtros.id_cliente);
            } else if(parameterNames[i] == "fecha_inicio"){
                whereCondition = whereCondition + " operacion.fecha_operacion>=TO_TIMESTAMP($"+(i+1)+",'YYYY-MM-DD')";
                queryParameters.push(filtros.fecha_inicio);
            } else if(parameterNames[i] == "fecha_fin"){
                whereCondition = whereCondition + " operacion.fecha_operacion<=TO_TIMESTAMP($"+(i+1)+",'YYYY-MM-DD')";
                queryParameters.push(filtros.fecha_fin);
            }
            i = i + 1;
        }
        queryFinal = queryFinal + whereCondition;
        const queryResponse = await conn.query(queryFinal, queryParameters);
        return queryResponse.rows;
    } catch (error) {
        console.log("Error en operacionModel.countRowsByFilters,", error);
        throw error;
    }
};

operacionModel.searchByFilters = async (conn, filtros) => {
    try {
        let queryFinal;
        let selectQuery = "SELECT operacion.*";
        let fromQuery = " FROM rrn.toperacion operacion";
        let whereCondition = "";
        let queryParameters = [];
        let parameterNames = [];
        if(filtros.id_tipo_operacion){
            parameterNames.push("id_tipo_operacion");
        }
        if(filtros.id_tipo_documento){
            parameterNames.push("id_tipo_documento");
        }
        if(filtros.id_cliente){
            parameterNames.push("id_cliente");
        }
        if(filtros.fecha_inicio){
            parameterNames.push("fecha_inicio");
        }
        if(filtros.fecha_fin){
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
            if(parameterNames[i] == "id_tipo_operacion"){
                selectQuery = selectQuery + ", tipo_op.nombre as tipo_operacion_nombre";
                fromQuery = fromQuery + " JOIN rrn.ttipo_operacion tipo_op ON tipo_op.id_tipo_operacion=operacion.id_tipo_operacion";
                whereCondition = whereCondition + " operacion.id_tipo_operacion=$"+(i+1);
                queryParameters.push(filtros.id_tipo_operacion);
            } else if(parameterNames[i] == "id_tipo_documento"){
                selectQuery = selectQuery + ", tipo_doc.descripcion as tipo_documento_descripcion";
                fromQuery = fromQuery + " JOIN rrn.ttipo_documento tipo_doc ON tipo_doc.id_tipo_documento=operacion.id_tipo_documento";
                whereCondition = whereCondition + " operacion.id_tipo_documento=$"+(i+1);
                queryParameters.push(filtros.id_tipo_documento);
            } else if(parameterNames[i] == "id_cliente"){
                selectQuery = selectQuery + ", cliente.razon_social"; 
                fromQuery = fromQuery + " JOIN rrn.tcliente cliente ON cliente.id_cliente=operacion.id_cliente";
                whereCondition = whereCondition + " operacion.id_cliente=$"+(i+1);
                queryParameters.push(filtros.id_cliente);
            } else if(parameterNames[i] == "fecha_inicio"){
                whereCondition = whereCondition + " operacion.fecha_operacion>=TO_TIMESTAMP($"+(i+1)+",'YYYY-MM-DD')";
                queryParameters.push(filtros.fecha_inicio);
            } else if(parameterNames[i] == "fecha_fin"){
                whereCondition = whereCondition + " operacion.fecha_operacion<=TO_TIMESTAMP($"+(i+1)+",'YYYY-MM-DD')";
                queryParameters.push(filtros.fecha_fin);
            }
            i = i + 1;
        }
        queryFinal = selectQuery + fromQuery + whereCondition + " ORDER BY operacion.id_operacion LIMIT $"+(i+1)+" OFFSET $"+(i+2);
        queryParameters.push(filtros.cantidad_filas);
        let bdCantidadFilas = new bigDecimal(filtros.cantidad_filas);
        let bdPaginas = new bigDecimal(filtros.pagina);
        queryParameters.push(bdCantidadFilas.multiply(bdPaginas).getValue());
        console.log("queryParameters:", queryParameters);
        const queryResponse = await conn.query(queryFinal, queryParameters);
        return queryResponse.rows;
    } catch (error) {
        console.log("operacionModel.searchByFilters,", error);
        throw error;
    }
};

module.exports = operacionModel;