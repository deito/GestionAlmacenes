const bigDecimal = require('js-big-decimal');
const operacionModel = require('../model/operacionModel');
const detalleOperacionModel = require('../model/detalleOperacionModel');
const tipoOperacionModel = require('../model/tipoOperacionModel');
const stockModel = require('../model/stockModel');
const movimientoModel = require('../model/movimientoModel');
const detalleMovimientoModel = require('../model/detalleMovimientoModel');
const postgresConn = require('../db/postgres');
const OperacionBean = require('../bean/operacionBean');
const DetalleOperacionBean = require('../bean/detalleOperacionBean');
const MovimientoBean = require('../bean/movimientoBean');
const DetalleMovimientoBean = require('../bean/detalleMovimientoBean');
const StockBean = require('../bean/stockBean');
const constantes = require('../util/constantes');
const utility = require('../util/utility');

const operacionService = {};

async function saveDevolucionCliente(client, operacion, detalles_operacion, detalleOperacionBeanList, operacionBean, response){
    try {
        // Validando inputs
        /*
        if(!operacion.numero_documento || operacion.numero_documento == constantes.emptyString){
            response.resultado = 0;
            response.mensaje = "El campo numero_documento no tiene un valor válido. Tipo de dato: '"+(typeof operacion.numero_documento)+"', valor = "+operacion.numero_documento;
            return response;
        }        
        if(!operacion.id_tipo_documento){
            response.resultado = 0;
            response.mensaje = "El campo id_tipo_documento no tiene un valor válido. Tipo de dato: '"+(typeof operacion.id_tipo_documento)+"', valor = "+operacion.id_tipo_documento;
            return response;
        }
        */
        if(!operacion.id_cliente){
            response.resultado = 0;
            response.mensaje = "El campo id_cliente no tiene un valor válido. Tipo de dato: '"+(typeof operacion.id_cliente)+"', valor = "+operacion.id_cliente;
            return response;
        }
        if(!operacion.id_local){
            response.resultado = 0;
            response.mensaje = "El campo id_local no tiene un valor válido. Tipo de dato: '"+(typeof operacion.id_local)+"', valor = "+operacion.id_local;
            return response;
        }
        /*
        const operacionBean = new OperacionBean();
        operacionBean.numero_documento = operacion.numero_documento;
        operacionBean.tipo_documento = { id_tipo_documento: operacion.id_tipo_documento };
        //operacionBean.proveedor = { id_proveedor: operacion.id_proveedor };
        operacionBean.fecha_operacion = operacion.fecha_operacion;
        operacionBean.usuario = { id_usuario: operacion.id_usuario };
        operacionBean.local = { id_local: operacion.id_local };
        //operacionBean.subtotal = operacion.subtotal;
        //operacionBean.igv = operacion.igv;
        //operacionBean.total = operacion.total;
        operacionBean.cliente = { id_cliente: operacion.id_cliente };
        operacionBean.motivo = operacion.motivo;
        operacionBean.descripcion = operacion.descripcion;
        operacionBean.tipo_operacion = { id_tipo_operacion: operacion.id_tipo_operacion };
        //operacionBean.id_local_origen = operacion.id_local_origen;
        //operacionBean.id_local_destino = operacion.id_local_destino;
        operacionBean.registrado_por = operacion.id_usuario;
        */
        await client.query("BEGIN");
        // guardar cabecera de Operacion
        const operacionModelRes = await operacionModel.save(client, operacionBean);
        console.log("operacionModelRes[0].id_operacion:", operacionModelRes[0].id_operacion);
        if(operacionModelRes && operacionModelRes[0].id_operacion){
            for(let i=0;i < detalles_operacion.length; i++){
                const detalleOperacionBean = new DetalleOperacionBean();
                detalleOperacionBean.operacion = { id_operacion: operacionModelRes[0].id_operacion };
                detalleOperacionBean.producto = { id_producto: detalles_operacion[i].id_producto };
                detalleOperacionBean.cantidad = detalles_operacion[i].cantidad;
                // Guardar detalle de Operacion
                const detalleOperacionModelRes = await detalleOperacionModel.save(client, detalleOperacionBean);
                if(detalleOperacionModelRes && detalleOperacionModelRes[0].id_detalle_operacion){
                    //ids_detalle_operacion.push(detalleOperacionModelRes[0].id_detalle_operacion);
                    detalleOperacionBean.id_detalle_operacion = detalleOperacionModelRes[0].id_detalle_operacion;
                    detalleOperacionBeanList.push(detalleOperacionBean);
                } else {
                    let mensaje = "Error al intentar insertar tdetalle_operacion:"+JSON.stringify(detalleOperacionModelRes)
                    console.log(mensaje);
                    await client.query("ROLLBACK");
                    response.resultado = 0;
                    response.mensaje = mensaje;
                    return response;
                }
            }
            console.log("detalleOperacionBeanList.length: "+detalleOperacionBeanList.length);

            //// Inicio: Guardar Movimiento
            const movimientoBean = new MovimientoBean();
            movimientoBean.tipo_movimiento = { id_tipo_movimiento: 1 };// 1 = ENTRADA (INGRESO)
            movimientoBean.fecha_movimieto = operacion.fecha_operacion;
            movimientoBean.operacion = { id_operacion: operacionModelRes[0].id_operacion };
            movimientoBean.local = { id_local: operacion.id_local };
            movimientoBean.registrado_por = operacion.id_usuario;

            // Guardar cabecera de Movimiento
            const movimientoModelRes = await movimientoModel.save(client, movimientoBean);
            console.log("movimientoModelRes[0].id_movimiento:", movimientoModelRes[0].id_movimiento);
            if(movimientoModelRes && movimientoModelRes[0].id_movimiento){
                for(let i=0;i < detalles_operacion.length; i++){
                    const detalleMovimientoBean = new DetalleMovimientoBean();
                    detalleMovimientoBean.movimiento = { id_movimiento: movimientoModelRes[0].id_movimiento };
                    detalleMovimientoBean.producto = detalles_operacion[i].id_producto;
                    detalleMovimientoBean.cantidad = detalles_operacion[i].cantidad;
                    // Guardar detalle de Movimiento
                    const detalleMovimientoModelRes = await detalleMovimientoModel.save(client, detalleMovimientoBean);
                    if(!detalleMovimientoModelRes || !detalleMovimientoModelRes[0].id_detalle_movimiento){
                        let mensaje = "Error al intentar insertar tdetalle_operacion:"+JSON.stringify(detalleOperacionModelRes)
                        console.log(mensaje);
                        await client.query("ROLLBACK");
                        response.resultado = 0;
                        response.mensaje = mensaje;
                        return response;
                    }
                }
            } else {
                let mensaje = "Error al intentar guardar el movimiento."
                console.log(mensaje);
                await client.query("ROLLBACK");
                response.resultado = 0;
                response.mensaje = mensaje;
                return response;
            }
            //// Fin: Guardar Movimiento

            // Inicio: Actualizar Stock
            for(let j=0;j < detalleOperacionBeanList.length; j++){
                const productoEnStock = await stockModel.getByIdProductoAndIdLocal(client, detalleOperacionBeanList[j].producto.id_producto, operacion.id_local);
                if(productoEnStock.length > 0){
                    // ya existe el producto y local en el stock
                    console.log("ya existe el producto y local en el stock. id_stock: "+productoEnStock[0].id_stock
                    +", id_producto: "+detalleOperacionBeanList[j].producto.id_producto+", id_local:"+operacion.id_local);
                    let cantidadParametro = new bigDecimal(detalleOperacionBeanList[j].cantidad);
                    let cantidadAnterior = new bigDecimal(productoEnStock[0].cantidad);
                    let nuevaCantidad = cantidadAnterior.add(cantidadParametro);
                    const stockBean = new StockBean();
                    stockBean.id_stock = productoEnStock[0].id_stock;
                    stockBean.cantidad = nuevaCantidad.getValue();
                    const stockModelRes = await stockModel.updateCantidadById(client, stockBean);
                    if(!stockModelRes){
                        let mensaje = "Error al intentar actualizar el stock. id_stock: "+stockBean.id_stock+", nueva cantidad: "+nuevaCantidad.getValue();
                        await client.query("ROLLBACK");
                        response.resultado = 0;
                        response.mensaje = mensaje;
                        return response;
                    }
                } else {
                    // el producto no existe en el stock
                    console.log("el producto no existe en el stock");
                    console.log("detalleOperacionBeanList["+j+"].cantidad:", detalleOperacionBeanList[j].cantidad);
                    console.log("detalleOperacionBeanList["+j+"].producto.id_producto:", detalleOperacionBeanList[j].producto.id_producto);
                    console.log("operacion.id_local:", operacion.id_local);
                    let cantidadParametro = new bigDecimal(detalleOperacionBeanList[j].cantidad);
                    const stockBean = new StockBean();
                    stockBean.cantidad = cantidadParametro.getValue();
                    stockBean.producto = { id_producto: detalleOperacionBeanList[j].producto.id_producto };
                    stockBean.local = { id_local: operacion.id_local };
                    const stockModelRes = await stockModel.save(client, stockBean);
                    if(!stockModelRes){
                        let mensaje = "Error al intentar guardar el stock. id_producto: "+stockBean.producto.id_producto+", id_local:"+operacion.id_local+", nueva cantidad: "+cantidadParametro.getValue();
                        console.log(mensaje);
                        await client.query("ROLLBACK");
                        response.resultado = 0;
                        response.mensaje = mensaje;
                        return response;
                    }
                }
            }
            // Fin: Actualizar Stock
            console.log("Todo bien?");
            console.log(detalleOperacionBeanList.length)
            if(detalleOperacionBeanList.length > 0){
                console.log("Todo bien.");
                response.resultado = 1;
                response.mensaje = "";
                response.id = operacionModelRes[0].id_operacion;
                await client.query('COMMIT');
                return response;
            } else {
                let mensaje = "Error al intentar guardar los detalles de Devolucion de Cliente.";
                await client.query("ROLLBACK");
                response.resultado = 0;
                response.mensaje = mensaje;
                return response;
            }
            
        } else {
            let mensaje = "Error al intentar guardar la Devolución del Cliente."
            console.log(mensaje);
            await client.query("ROLLBACK");
            response.resultado = 0;
            response.mensaje = mensaje;
            return response;
        }
        
    } catch (error) {
        console.log("Error en operacionService => saveDevolucionCliente,", error);
        throw error;
    }
}

operacionService.getAllTipoOperacion = async (req, res) => {
    try {
        const response = {
            resultado: 0,
            mensaje: "Error inesperado al buscar Tipos de Operacion."
        };
        const tipoOperacionModelRes = await tipoOperacionModel.getAll(postgresConn);
        if(tipoOperacionModelRes){
            response.resultado = 1;
            response.mensaje = "";
            response.lista = tipoOperacionModelRes;
        } else {
            esponse.resultado = 0;
            response.mensaje = "Error al momento de obtener los Tipos de Operacion.";
        }
        res.status(200).json(response);
    } catch (error) {
        console.log("Error en operacionService.getAllTipoOperacion,", error);
        res.status(500).send(error);
    }
};

operacionService.save = async (req, res) => {
    const client = await postgresConn.getClient();
    try {
        let response = {
            resultado: 0,
            mensaje: "Error inesperado al guardar la nueva Operacion."
        };
        let { operacion, detalles_operacion } = req.body;
        if(!operacion.id_tipo_operacion){
            response.resultado = 0;
            response.mensaje = "El campo id_tipo_operacion no tiene un valor válido. Tipo de dato: '"+(typeof operacion.id_tipo_operacion)+"', valor = "+operacion.id_tipo_operacion;
            res.status(200).json(response);
            return;
        }
        if(!operacion.id_usuario){
            response.resultado = 0;
            response.mensaje = "El campo id_usuario no tiene un valor válido. Tipo de dato: '"+(typeof operacion.id_usuario)+"', valor = "+operacion.id_usuario;
            res.status(200).json(response);
            return;
        }
        /*
        if(!operacion.registrado_por){
            response.resultado = 0;
            response.mensaje = "El campo registrado_por no tiene un valor válido. Tipo de dato: '"+(typeof operacion.registrado_por)+"', valor = "+operacion.registrado_por;
            res.status(200).json(response);
            return;
        }
        */
        if(!operacion){
            response.resultado = 0;
            response.mensaje = "El objeto operacion no tiene un valor válido. Tipo de dato: '"+(typeof operacion)+"', valor = "+JSON.stringify(operacion);
            res.status(200).json(response);
            return;
        }
        if(!detalles_operacion || detalles_operacion.length < 1){
            response.resultado = 0;
            response.mensaje = "El array detalles_operacion no tiene un valor válido o no tiene por lo menos 1 elemento. Tipo de dato: '"+(typeof detalles_operacion)+"', valor = "+JSON.stringify(detalles_operacion);
            res.status(200).json(response);
            return;
        }

        if(!utility.validateStringDateYYYYMMDD(operacion.fecha_operacion)){
            response.resultado = 0;
            response.mensaje = "El campo fecha_operacion no tiene un valor válido. Tipo de dato: '"+(typeof operacion.fecha_operacion)+"', valor = "+operacion.fecha_operacion;
            res.status(200).json(response);
            return;
        }
        
        const operacionBean = new OperacionBean();
        operacionBean.numero_documento = operacion.numero_documento;
        operacionBean.tipo_documento = { id_tipo_documento: operacion.id_tipo_documento };
        operacionBean.proveedor = { id_proveedor: operacion.id_proveedor };
        operacionBean.fecha_operacion = operacion.fecha_operacion;
        operacionBean.usuario = { id_usuario: operacion.id_usuario };
        operacionBean.local = { id_local: operacion.id_local };
        operacionBean.subtotal = operacion.subtotal;
        operacionBean.igv = operacion.igv;
        operacionBean.total = operacion.total;
        operacionBean.cliente = { id_cliente: operacion.id_cliente };
        operacionBean.motivo = operacion.motivo;
        operacionBean.descripcion = operacion.descripcion;
        operacionBean.tipo_operacion = { id_tipo_operacion: operacion.id_tipo_operacion };
        operacionBean.id_local_origen = operacion.id_local_origen;
        operacionBean.id_local_destino = operacion.id_local_destino;
        operacionBean.registrado_por = operacion.id_usuario;
        
        const detalleOperacionBeanList = [];

        // Validando tipo de operacion
        let seGuardo;
        if(operacion.id_tipo_operacion == 4){
            // operacion.id_tipo_operacion == 4: DEVOLUCION DE CLIENTE
            seGuardo = await saveDevolucionCliente(client, operacion, detalles_operacion, detalleOperacionBeanList, operacionBean, response);
            console.log("seGuardo:", seGuardo);
            if(seGuardo) {                
                response = seGuardo;
            }
        } else {
            response.resultado = 0;
            response.mensaje = "El id_tipo_operacion = "+operacion.id_tipo_operacion+" no tiene un servicio disponible.";
        }

        res.status(200).json(response);
    } catch (error) {
        await client.query("ROLLBACK");
        console.log("Error en operacionService.save:", error);
        res.status(500).send(error);
    } finally {
        client.release();
    }
};



module.exports = operacionService;