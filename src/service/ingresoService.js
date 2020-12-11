const bigDecimal = require('js-big-decimal');
const ingresoModel = require('../model/ingresoModel');
const ingresoDetalleModel = require('../model/ingresoDetalleModel');
const stockModel = require('../model/stockModel');
const postgresConn = require('../db/postgres');
const IngresoBean = require('../bean/ingresoBean');
const IngresoDetalleBean = require('../bean/ingresoDetalleBean');
const StockBean = require('../bean/stockBean');
const constantes = require('../util/constantes');
const utility = require('../util/utility');
const ingresoService = {};

ingresoService.nuevoIngreso = async (req, res) => {
    const client = await postgresConn.getClient();
    try {
        const response = {
            resultado: 0,
            mensaje: "Error inesperado al guardar un nuevo Ingreso."
        };
        let { ingreso, ingreso_detalles } = req.body;
        if(!ingreso){
            response.resultado = 0;
            response.mensaje = "El objeto ingreso no tiene un valor válido. Tipo de dato: '"+(typeof ingreso)+"', valor = "+JSON.stringify(ingreso);
            res.status(200).json(response);
            return;
        }
        if(!ingreso_detalles || ingreso_detalles.length < 1){
            response.resultado = 0;
            response.mensaje = "El array ingreso_detalles no tiene un valor válido o no tiene por lo menos 1 elemento. Tipo de dato: '"+(typeof ingreso_detalles)+"', valor = "+JSON.stringify(ingreso_detalles);
            res.status(200).json(response);
            return;
        }

        if(!utility.validateStringDateYYYYMMDD(ingreso.fecha_ingreso)){
            response.resultado = 0;
            response.mensaje = "El campo fecha_ingreso no tiene un valor válido. Tipo de dato: '"+(typeof ingreso.fecha_ingreso)+"', valor = "+ingreso.fecha_ingreso;
            res.status(200).json(response);
            return;
        }
        
        const ingresoBean = new IngresoBean();
        ingresoBean.tipo_ingreso = ingreso.tipo_ingreso;
        ingresoBean.fecha_ingreso = ingreso.fecha_ingreso;
        ingresoBean.motivo = ingreso.motivo;
        ingresoBean.cliente = {id_cliente: ingreso.id_cliente };
        ingresoBean.descripcion = ingreso.descripcion;
        ingresoBean.usuario = { id_usuario: ingreso.id_usuario };
        ingresoBean.local = { id_local: ingreso.id_local };
        ingresoBean.registrado_por = ingreso.registrado_por;
        ingresoBean.fecha_registro = new Date();

        await client.query("BEGIN");
        // guardar cabecera de Ingreso
        const ingresoModelRes = await ingresoModel.save(client, ingresoBean);
        console.log("ingresoModelRes[0].id_ingreso:", ingresoModelRes[0].id_ingreso);
        if(ingresoModelRes && ingresoModelRes[0].id_ingreso){            
            const ids_ingreso_detalle = [];
            const ingresoDetalleBeanList = [];
            for(let i=0;i < ingreso_detalles.length; i++){
                const ingresoDetalleBean = new IngresoDetalleBean();
                ingresoDetalleBean.ingreso = { id_ingreso: ingresoModelRes[0].id_ingreso };
                ingresoDetalleBean.producto = { id_producto: ingreso_detalles[i].id_producto };
                ingresoDetalleBean.cantidad = ingreso_detalles[i].cantidad;
                // Guardar detalle de Ingreso
                const ingresoDetalleModelRes = await ingresoDetalleModel.save(client, ingresoDetalleBean);
                if(ingresoDetalleModelRes && ingresoDetalleModelRes[0].id_ingreso_detalle){
                    ids_ingreso_detalle.push(ingresoDetalleModelRes[0].id_ingreso_detalle);
                    ingresoDetalleBean.id_ingreso_detalle = ingresoDetalleModelRes[0].id_ingreso_detalle;
                    ingresoDetalleBeanList.push(ingresoDetalleBean);
                } else {
                    //throw new Error('Error al intentar insertar tingreso_detalle: '+ingresoDetalleModelRes);
                    console.log("Error al intentar insertar tingreso_detalle:", ingresoDetalleModelRes);
                    await client.query("ROLLBACK");
                    response.resultado = 0;
                    response.mensaje = "Error al insertar tingreso_detalle. "+JSON.stringify(ingresoDetalleModelRes);                
                    res.status(200).json(response);
                    return;
                }
            }
            console.log("ids_ingreso_detalle:", ids_ingreso_detalle);
            // actualizar stock
            for(let j=0;j < ingresoDetalleBeanList.length; j++){
                const productoEnStock = await stockModel.getByIdProductoAndIdLocal(client, ingresoDetalleBeanList[j].producto.id_producto, ingreso.id_local);
                if(productoEnStock.length > 0){
                    // ya existe el producto y local en el stock
                    console.log("ya existe el producto y local en el stock. id_stock: "+productoEnStock[0].id_stock
                    +", id_producto: "+ingresoDetalleBeanList[j].producto.id_producto+", id_local:"+ingreso.id_local);
                    let cantidadParametro = new bigDecimal(ingresoDetalleBeanList[j].cantidad);
                    let cantidadAnterior = new bigDecimal(productoEnStock[0].cantidad);
                    let suma = cantidadAnterior.add(cantidadParametro);
                    const stockBean = new StockBean();
                    stockBean.id_stock = productoEnStock[0].id_stock;
                    stockBean.cantidad = suma.getValue();
                    const stockModelRes = await stockModel.updateCantidadById(client, stockBean);
                    if(!stockModelRes){
                        console.log("Error al intentar actualizar el stock. id_stock: "+stockBean.id_stock+", nueva cantidad: "+suma.getValue());
                        await client.query("ROLLBACK");
                        response.resultado = 0;
                        response.mensaje = "Error al intentar actualizar el stock.";                
                        res.status(200).json(response);
                        return;
                    }
                } else {
                    // el producto no existe en el stock
                    console.log("el producto no existe en el stock");
                    console.log("ingresoDetalleBeanList["+j+"].cantidad:", ingresoDetalleBeanList[j].cantidad);
                    console.log("ingresoDetalleBeanList["+j+"].producto.id_producto:", ingresoDetalleBeanList[j].producto.id_producto);
                    console.log("ingreso.id_local:", ingreso.id_local);
                    let cantidadParametro = new bigDecimal(ingresoDetalleBeanList[j].cantidad);
                    const stockBean = new StockBean();
                    stockBean.cantidad = cantidadParametro.getValue();
                    stockBean.producto = { id_producto: ingresoDetalleBeanList[j].producto.id_producto };
                    stockBean.local = { id_local: ingreso.id_local };
                    const stockModelRes = await stockModel.save(client, stockBean);
                    if(!stockModelRes){
                        console.log("Error al intentar guardar el stock. id_producto: "+stockBean.producto.id_producto+", id_local:"+ingreso.id_local+", nueva cantidad: "+cantidadParametro.getValue());
                        await client.query("ROLLBACK");
                        response.resultado = 0;
                        response.mensaje = "Error al intentar actualizar el stock.";                
                        res.status(200).json(response);
                        return;
                    }
                }
            }
            
            if(ids_ingreso_detalle.length > 0){
                response.resultado = 1;
                response.mensaje = "";
                response.id = ingresoModelRes[0].id_ingreso;
            } else {
                console.log("Error al intentar guardar los detalles de Ingreso.");
                await client.query("ROLLBACK");
                response.resultado = 0;
                response.mensaje = "Error al intentar los detalles de Ingreso.";                
                res.status(200).json(response);
                return;
            }
            await client.query('COMMIT')
            res.status(200).json(response);
        } else {
            console.log("Error al intentar guardar el nuevo Ingreso.");
            await client.query("ROLLBACK");
            response.resultado = 0;
            response.mensaje = "Error al intentar guardar el nuevo Ingreso."
            res.status(200).json(response);
            return;
        }

    } catch (error) {
        await client.query("ROLLBACK");
        console.log("Error en ingresoService.nuevoIngreso:", error);
        res.status(500).send(error);
    } finally {
        client.release();
    }
};

ingresoService.countRows = async (req, res) => {
    try {
        const response = {
            resultado: 0,
            mensaje: "Error inesperado al contar Ingresos."
        };
        const ingresoModelRes = await ingresoModel.countRows(postgresConn);
        if(ingresoModelRes){
            response.resultado = 1;
            response.mensaje = "";
            response.cantidad = ingresoModelRes[0].cantidad;
        } else {
            response.resultado = 0;
            response.mensaje = "Error al momento de contar Ingresos en la base de datos.";
        }
        res.status(200).json(response);
    } catch (error) {
        console.log('Error en ingresoService.countRows,', error);
        res.status(500).send(error);
    }
};

ingresoService.searchByPagination = async (req, res) => {
    try {
        const response = {
            resultado: 0,
            mensaje: "Error inesperado al buscar Ingresos."
        };
        let { cantidad_filas, pagina } = req.body;
        if(!cantidad_filas || cantidad_filas < 1){
            response.resultado = 0,
            response.mensaje = "Error, la cantidad de filas no es valida. cantidad_filas = "+cantidad_filas;
            res.status(200).json(response);
            return;
        }
        if(!pagina || pagina < 1){
            response.resultado = 0,
            response.mensaje = "Error, el valor de la pagina no es valida. pagina = "+pagina;
            res.status(200).json(response);
            return;
        }
        pagina = pagina - 1;
        const ingresoModelRes = await ingresoModel.searchByLimitAndOffset(postgresConn, cantidad_filas, pagina);
        if(ingresoModelRes){
            response.resultado = 1;
            response.mensaje = "";
            response.lista = ingresoModelRes;
        } else {
            response.resultado = 0;
            response.mensaje = "Error al momento de buscar Ingresos en la base de datos.";
        }
        res.status(200).json(response);
    } catch (error) {
        console.log('Error en ingresoService.searchByLimitAndOffset,', error);
        res.status(500).send(error);
    }
};

ingresoService.getById = async (req, res) => {
    try {
        const response = {
            resultado: 0,
            mensaje: "Error inesperado al buscar Ingreso por id."
        };
        const { id } = req.query;
        if(!id){
            response.resultado = 0;
            response.mensaje = "El campo id no tiene un valor válido. id = "+id;
        }
        const ingresoModelRes = await ingresoModel.getById(postgresConn, id);
        console.log("ingresoModelRes[0].id_ingreso:", ingresoModelRes[0].id_ingreso);
        if(ingresoModelRes){
            if (ingresoModelRes.length > 0) {
                const ingresoDetalleModelRes = await ingresoDetalleModel.getByIdIngreso(postgresConn, ingresoModelRes[0].id_ingreso);
                if(ingresoDetalleModelRes){
                    response.resultado = 1;
                    response.mensaje = "";
                    response.objeto = ingresoModelRes[0];
                    response.lista = ingresoDetalleModelRes;
                } else {
                    response.resultado = 0;
                    response.mensaje = "Error al momento de obtener los detalles del Ingreso.";
                }                
            } else {
                response.resultado = 1;
                response.mensaje = "";
                response.objeto = {};
            }
        } else {
            response.resultado = 0;
            response.mensaje = "Error al momento de obtener el Ingreso.";
        }
        res.status(200).json(response);
    } catch (error) {
        console.log("Error en ingresoService.getById,", error);
        res.status(500).send(error);
    }
};

ingresoService.update = async (req, res) => {
    const client = await postgresConn.getClient();
    try {
        const response = {
            resultado: 0,
            mensaje: "Error inesperado al actualizar el Ingreso."
        };
        let { ingreso, ingreso_detalles } = req.body;
        if(!ingreso){
            response.resultado = 0;
            response.mensaje = "El objeto ingreso no tiene un valor válido. Tipo de dato: '"+(typeof ingreso)+"', valor = "+JSON.stringify(ingreso);
            res.status(200).json(response);
            return;
        }
        if(!ingreso.id_ingreso){
            response.resultado = 0;
            response.mensaje = "El campo id_ingreso no tiene un valor válido. Tipo de dato: '"+(typeof id_ingreso)+"', valor = "+id_ingreso;
            res.status(200).json(response);
            return;
        }
        if(!ingreso_detalles || ingreso_detalles.length < 1){
            response.resultado = 0;
            response.mensaje = "El array ingreso_detalles no tiene un valor válido o no tiene por lo menos 1 elemento. Tipo de dato: '"+(typeof ingreso_detalles)+"', valor = "+JSON.stringify(ingreso_detalles);
            res.status(200).json(response);
            return;
        }

        if(!utility.validateStringDateYYYYMMDD(ingreso.fecha_ingreso)){
            response.resultado = 0;
            response.mensaje = "El campo fecha_ingreso no tiene un valor válido. Tipo de dato: '"+(typeof ingreso.fecha_ingreso)+"', valor = "+ingreso.fecha_ingreso;
            res.status(200).json(response);
            return;
        }

        const ingresoBean = new IngresoBean();
        ingresoBean.id_ingreso = ingreso.id_ingreso;
        ingresoBean.tipo_ingreso = ingreso.tipo_ingreso;
        ingresoBean.fecha_ingreso = ingreso.fecha_ingreso;
        ingresoBean.motivo = ingreso.motivo;
        ingresoBean.cliente = {id_cliente: ingreso.id_cliente };
        ingresoBean.descripcion = ingreso.descripcion;
        ingresoBean.usuario = { id_usuario: ingreso.id_usuario };
        ingresoBean.local = { id_local: ingreso.id_local };
        ingresoBean.modificado_por = ingreso.modificado_por;
        ingresoBean.fecha_modificacion = new Date();

        const ingresoDetalleModelActualRes = await ingresoDetalleModel.getOnlyThisTableByIdIngreso(postgresConn, ingresoBean.id_ingreso);
        console.log("ingresoDetalleModelActualRes:", ingresoDetalleModelActualRes);
        if(ingresoDetalleModelActualRes){
            /*
            if(ingresoDetalleModelActualRes.length > 0){
                if(ingresoDetalleModelActualRes.length != ingreso_detalles.length){

                } else {
                    for(let i=0;i < ingresoDetalleModelActualRes.length;i++){
                        for(let j=0;j < ingreso_detalles.length;j++){
                            if(ingresoDetalleModelActualRes[i].id_ingreso_detalle==ingreso_detalles.id_ingreso_detalle){

                            }
                        }
                    }
                }
            } else {
                response.resultado = 0;
                response.mensaje = "Error, no hay Detalles de Ingreso en la base de datos para el id_ingreso = "+ingreso.id_ingreso;
                res.status(200).json(response);
                return;
            }
            */
            if(ingresoDetalleModelActualRes.length > 0){
                await client.query("BEGIN");
                // Actualizamos Ingreso
                const ingresoModelRes = await ingresoModel.updateById(client, ingresoBean);
                if(!ingresoModelRes){
                    // Si la actualizacion de Ingreso fallo
                    console.log("Error, no se pudo actualizar el Ingreso en la base de datos con el id_ingreso =", ingreso.id_ingreso);
                    await client.query("ROLLBACK");
                    response.resultado = 0;
                    response.mensaje = "Error, no se pudo borrar el Detalle de Ingreso en la base de datos con el id_ingreso_detalle = "+ingresoDetalleModelActualRes[i].id_ingreso_detalle;
                    res.status(200).json(response);
                    return;
                }

                // borrando detalle_ingreso actuales
                const seBorro = await ingresoDetalleModel.deleteByIdIngreso(client, ingreso.id_ingreso);
                if(!seBorro){
                    //throw new Error("Error, no se pudo borrar el Detalle de Ingreso en la base de datos con el id_ingreso_detalle = "+ingresoDetalleModelActualRes[i].id_ingreso_detalle);
                    console.log("Error, no se pudo borrar el Detalle de Ingreso en la base de datos con el id_ingreso =", ingreso.id_ingreso);
                    await client.query("ROLLBACK");
                    response.resultado = 0;
                    response.mensaje = "Error, no se pudo borrar el Detalle de Ingreso en la base de datos con el id_ingreso = "+ingreso.id_ingreso;
                    res.status(200).json(response);
                    return;
                }
                /*
                for(let i=0;i < ingresoDetalleModelActualRes.length;i++){
                    const seBorro = await ingresoDetalleModel.deleteById(client, ingresoDetalleModelActualRes[i].id_ingreso_detalle);
                    if(!seBorro){
                        //throw new Error("Error, no se pudo borrar el Detalle de Ingreso en la base de datos con el id_ingreso_detalle = "+ingresoDetalleModelActualRes[i].id_ingreso_detalle);
                        console.log("Error, no se pudo borrar el Detalle de Ingreso en la base de datos con el id_ingreso_detalle =", ingresoDetalleModelActualRes[i].id_ingreso_detalle);
                        await client.query("ROLLBACK");
                        response.resultado = 0;
                        response.mensaje = "Error, no se pudo borrar el Detalle de Ingreso en la base de datos con el id_ingreso_detalle = "+ingresoDetalleModelActualRes[i].id_ingreso_detalle;
                        res.status(200).json(response);
                        return;
                    }
                }
                */
                // insertando nuevos detalles
                const ids_ingreso_detalle = [];
                for(let i=0;i < ingreso_detalles.length;i++){
                    const ingresoDetalleBean = new IngresoDetalleBean();
                    ingresoDetalleBean.ingreso = { id_ingreso: ingreso.id_ingreso };
                    ingresoDetalleBean.producto = { id_producto: ingreso_detalles[i].id_producto };
                    ingresoDetalleBean.cantidad = ingreso_detalles[i].cantidad;
                    const ingresoDetalleModelRes = await ingresoDetalleModel.save(client, ingresoDetalleBean);
                    if(ingresoDetalleModelRes && ingresoDetalleModelRes[0].id_ingreso_detalle){
                        ids_ingreso_detalle.push(ingresoDetalleModelRes[0].id_ingreso_detalle);
                    } else {
                        //throw new Error('Error al intentar insertar tingreso_detalle: '+ingresoDetalleModelRes);
                        console.log("Error al intentar insertar tingreso_detalle:", ingresoDetalleModelRes);
                        await client.query("ROLLBACK");
                        response.resultado = 0;
                        response.mensaje = "Error al intentar insertar tingreso_detalle";
                        res.status(200).json(response);
                        return;
                    }
                }
                console.log("ids_ingreso_detalle:", ids_ingreso_detalle);
                if(ids_ingreso_detalle.length > 0){
                    response.resultado = 1;
                    response.mensaje = "";
                    response.id = ingreso.id_ingreso;
                } else {
                    response.resultado = 0;
                    response.mensaje = "Error al intentar guardar el producto.";
                }
                await client.query('COMMIT');
                res.status(200).json(response);
            } else {
                response.resultado = 0;
                response.mensaje = "Error, no hay Detalles de Ingreso en la base de datos para el id_ingreso = "+ingreso.id_ingreso;
                res.status(200).json(response);
                return;
            }    
        } else {
            response.resultado = 0;
            response.mensaje = "Error al momento de buscar detalles de Ingreso.";
            res.status(200).json(response);
            return;
        }
    } catch (error) {
        await client.query("ROLLBACK");
        console.log("Error en ingresoService.updateById,", error);
        res.status(500).send(error);
    } finally {
        client.release();
    }
};

ingresoService.countRowsByTipoIngresoAndRangoFecha = async (req, res) => {
    try {
        const response = {
            resultado: 0,
            mensaje: "Error inesperado al contar Ingresos."
        };
        let { tipo_ingreso, fecha_inicio, fecha_fin } = req.body;
        const ingresoModelRes = await ingresoModel.countRowsByTipoIngresoAndRangoFecha(postgresConn, 
            tipo_ingreso, fecha_inicio, fecha_fin);
        if(ingresoModelRes){
            response.resultado = 1;
            response.mensaje = "";
            response.cantidad = ingresoModelRes[0].cantidad;
        } else {
            response.resultado = 0;
            response.mensaje = "Error al momento de contar Ingresos en la base de datos.";
        }
        res.status(200).json(response);
    } catch (error) {
        console.log("Error en ingresoService.countRowsByTipoIngresoAndRangoFecha,", error);
        res.status(500).send(error);
    }
}

ingresoService.searchByTipoIngresoAndRangoFechaAndPagination = async (req, res) => {
    try {
        const response = {
            resultado: 0,
            mensaje: "Error inesperado al buscar Ingresos."
        };
        let { tipo_ingreso, fecha_inicio, fecha_fin, cantidad_filas, pagina } = req.body;
        console.log("tipo_ingreso:", tipo_ingreso);
        if(!tipo_ingreso || tipo_ingreso == constantes.emptyString){
            tipo_ingreso = null;
        }
        if(!fecha_inicio || fecha_inicio == constantes.emptyString){
            fecha_inicio = null;
        }
        if(!fecha_fin || fecha_fin == constantes.emptyString){
            fecha_fin = null;
        }
        if(!cantidad_filas || cantidad_filas < 1){
            response.resultado = 0,
            response.mensaje = "Error, la cantidad de filas no es valida. cantidad_filas = "+cantidad_filas;
            res.status(200).json(response);
            return;
        }
        if(!pagina || pagina < 1){
            response.resultado = 0,
            response.mensaje = "Error, el valor de la pagina no es valida. pagina = "+pagina;
            res.status(200).json(response);
            return;
        }
        pagina = pagina - 1;
        const ingresoModelRes = await ingresoModel.searchByTipoIngresoAndRangoFechaAndLimitAndOffset(postgresConn, 
            tipo_ingreso, fecha_inicio, fecha_fin, cantidad_filas, pagina);
        if(ingresoModelRes){
            response.resultado = 1;
            response.mensaje = "";
            response.lista = ingresoModelRes;
        } else {
            response.resultado = 0;
            response.mensaje = "Error al momento de buscar Ingresos en la base de datos.";
        }
        res.status(200).json(response);
    } catch (error) {
        console.log("Error en ingresoService.searchByTipoIngresoAndRangoFechaAndPagination,", error);
        res.status(500).send(error);
    }
};

module.exports = ingresoService;