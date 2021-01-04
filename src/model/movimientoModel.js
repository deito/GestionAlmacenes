const bigDecimal = require('js-big-decimal');
const movimientoModel = {};

movimientoModel.save = async (conn, movimientoBean) => {
    try {
        const queryResponse = await conn.query("INSERT INTO rrn.tmovimiento (id_tipo_movimiento, fecha_movimieto, id_operacion, id_local, fecha_registro, registrado_por)"
        +" VALUES($1, to_timestamp($2,'YYYY-MM-DD'), $3, $4, NOW(), $5) RETURNING id_movimiento",
        [movimientoBean.tipo_movimiento.id_tipo_movimiento, movimientoBean.fecha_movimieto, movimientoBean.operacion.id_operacion, movimientoBean.local.id_local,
        movimientoBean.registrado_por]);
        return queryResponse.rows;
    } catch (error) {
        console.log("Error en movimientoModel.save,", error);
        throw error;
    }
};

movimientoModel.countRowsByFilters = async (conn, filtros) => {
    try {
        let queryFinal;
        let selectQuery = "SELECT COUNT(*) as cantidad";
        let fromQuery = " FROM rrn.tmovimiento movimiento"
        let whereCondition = "";
        let queryParameters = [];
        let parameterNames = [];
        if(filtros.id_tipo_movimiento){
            parameterNames.push("id_tipo_movimiento");
        }
        if(filtros.fecha_inicio){
            parameterNames.push("fecha_inicio");
        }
        if(filtros.fecha_fin){
            parameterNames.push("fecha_fin");
        }
        if(filtros.id_local){
            parameterNames.push("id_local");
        }
        if(filtros.id_tipo_operacion){
            parameterNames.push("id_tipo_operacion");
        }

        if(parameterNames.length > 0){
            whereCondition = " WHERE";
        }

        let i=0;
        for(;i < parameterNames.length;){
            if(i > 0){
                whereCondition = whereCondition + " AND"
            }
            if(parameterNames[i] == "id_tipo_movimiento"){
                whereCondition = whereCondition + " movimiento.id_tipo_movimiento=$"+(i+1);
                queryParameters.push(filtros.id_tipo_movimiento);
            } else if(parameterNames[i] == "fecha_inicio"){
                whereCondition = whereCondition + " movimiento.fecha_movimieto>=TO_TIMESTAMP($"+(i+1)+",'YYYY-MM-DD')";
                queryParameters.push(filtros.fecha_inicio);
            } else if(parameterNames[i] == "fecha_fin"){
                whereCondition = whereCondition + " movimiento.fecha_movimieto<=TO_TIMESTAMP($"+(i+1)+",'YYYY-MM-DD')";
                queryParameters.push(filtros.fecha_fin);
            } else if(parameterNames[i] == "id_local"){
                whereCondition = whereCondition + " movimiento.id_local=$"+(i+1);
                queryParameters.push(filtros.id_local);
            } else if(parameterNames[i] == "id_tipo_operacion"){
                fromQuery = fromQuery + " JOIN rrn.toperacion operacion ON operacion.id_operacion=movimiento.id_operacion";
                whereCondition = whereCondition + " operacion.id_tipo_operacion=$"+(i+1);
                queryParameters.push(filtros.id_tipo_operacion);
            }
            i = i + 1;
        }
        queryFinal = selectQuery + fromQuery + whereCondition;
        const queryResponse = await conn.query(queryFinal, queryParameters);
        return queryResponse.rows;
    } catch (error) {
        console.log("Error en movimientoModel.countRowsByFilters,", error);
        throw error;
    }
};

movimientoModel.searchByFilters = async (conn, filtros) => {
    try {
        let queryFinal;
        let selectQuery = "SELECT movimiento.*, tipo_operacion.id_tipo_operacion, tipo_operacion.nombre as tipo_operacion_nombre"
        +", tipo_movimiento.nombre as tipo_movimiento_nombre, local.nombre as local_nombre, usuario.usuario";
        let fromQuery = " FROM rrn.tmovimiento movimiento JOIN rrn.toperacion operacion ON operacion.id_operacion=movimiento.id_operacion"
        +" JOIN rrn.ttipo_operacion tipo_operacion ON tipo_operacion.id_tipo_operacion=operacion.id_tipo_operacion"
        +" JOIN rrn.ttipo_movimiento tipo_movimiento ON tipo_movimiento.id_tipo_movimiento=movimiento.id_tipo_movimiento"
        +" JOIN rrn.tlocal local ON local.id_local=movimiento.id_local"
        +" JOIN rrn.tusuario usuario ON usuario.id_usuario=operacion.id_usuario";
        let whereCondition = "";
        let queryParameters = [];
        let parameterNames = [];
        if(filtros.id_tipo_movimiento){
            parameterNames.push("id_tipo_movimiento");
        }
        if(filtros.fecha_inicio){
            parameterNames.push("fecha_inicio");
        }
        if(filtros.fecha_fin){
            parameterNames.push("fecha_fin");
        }
        if(filtros.id_local){
            parameterNames.push("id_local");
        }
        if(filtros.id_tipo_operacion){
            parameterNames.push("id_tipo_operacion");
        }

        if(parameterNames.length > 0){
            whereCondition = " WHERE";
        }

        let i=0;
        for(;i < parameterNames.length;){
            if(i > 0){
                whereCondition = whereCondition + " AND"
            }
            if(parameterNames[i] == "id_tipo_movimiento"){
                whereCondition = whereCondition + " movimiento.id_tipo_movimiento=$"+(i+1);
                queryParameters.push(filtros.id_tipo_movimiento);
            } else if(parameterNames[i] == "fecha_inicio"){
                whereCondition = whereCondition + " movimiento.fecha_movimieto>=TO_TIMESTAMP($"+(i+1)+",'YYYY-MM-DD')";
                queryParameters.push(filtros.fecha_inicio);
            } else if(parameterNames[i] == "fecha_fin"){
                whereCondition = whereCondition + " movimiento.fecha_movimieto<=TO_TIMESTAMP($"+(i+1)+",'YYYY-MM-DD')";
                queryParameters.push(filtros.fecha_fin);
            } else if(parameterNames[i] == "id_local"){
                whereCondition = whereCondition + " movimiento.id_local=$"+(i+1);
                queryParameters.push(filtros.id_local);
            } else if(parameterNames[i] == "id_tipo_operacion"){
                whereCondition = whereCondition + " operacion.id_tipo_operacion=$"+(i+1);
                queryParameters.push(filtros.id_tipo_operacion);
            }
            i = i + 1;
        }
        queryFinal = selectQuery + fromQuery + whereCondition + " ORDER BY movimiento.id_movimiento LIMIT $"+(i+1)+" OFFSET $"+(i+2);
        queryParameters.push(filtros.cantidad_filas);
        let bdCantidadFilas = new bigDecimal(filtros.cantidad_filas);
        let bdPaginas = new bigDecimal(filtros.pagina);
        queryParameters.push(bdCantidadFilas.multiply(bdPaginas).getValue());
        console.log("queryParameters:", queryParameters);
        const queryResponse = await conn.query(queryFinal, queryParameters);
        return queryResponse.rows;
    } catch (error) {
        console.log("movimientoModel.searchByFilters,", error);
        throw error;
    }
};

module.exports = movimientoModel;