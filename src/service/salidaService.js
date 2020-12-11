const bigDecimal = require('js-big-decimal');
const salidaModel = require('../model/salidaModel');
const salidaDetalleModel = require('../model/salidaDetalleModel');
const stockModel = require('../model/stockModel');
const postgresConn = require('../db/postgres');
const SalidaBean = require('../bean/salidaBean');
const SalidaDetalleBean = require('../bean/salidaDetalleBean');
const StockBean = require('../bean/stockBean');
const constantes = require('../util/constantes');
const utility = require('../util/utility');
const salidaService = {};

salidaService.save = async (req, res) => {
    const client = await postgresConn.getClient();
    try {
        const response = {
            resultado: 0,
            mensaje: "Error inesperado al guardar la nueva Salida."
        };
        let { salida, salida_detalles } = req.body;
        if(!salida){
            response.resultado = 0;
            response.mensaje = "El objeto salida no tiene un valor válido. Tipo de dato: '"+(typeof salida)+"', valor = "+JSON.stringify(salida);
            res.status(200).json(response);
            return;
        }
        if(!salida_detalles || salida_detalles.length < 1){
            response.resultado = 0;
            response.mensaje = "El array salida_detalles no tiene un valor válido o no tiene por lo menos 1 elemento. Tipo de dato: '"+(typeof salida_detalles)+"', valor = "+JSON.stringify(salida_detalles);
            res.status(200).json(response);
            return;
        }
        if(!utility.validateStringDateYYYYMMDD(salida.fecha_salida)){
            response.resultado = 0;
            response.mensaje = "El campo fecha_salida no tiene un valor válido. Tipo de dato: '"+(typeof salida.fecha_salida)+"', valor = "+salida.fecha_salida;
            res.status(200).json(response);
            return;
        }

        const salidaBean = new SalidaBean();
        salidaBean.tipo_salida = salida.tipo_salida;
        salidaBean.fecha_salida = salida.fecha_salida;
        salidaBean.motivo = salida.motivo;
        salidaBean.proveedor = { id_proveedor: salida.id_proveedor };
        salidaBean.descripcion = salida.descripcion;
        salidaBean.usuario = { id_usuario: salida.id_usuario };
        salidaBean.local = { id_local: salida.id_local };
        salidaBean.registrado_por = salida.registrado_por;
        salidaBean.fecha_registro = new Date();

        await client.query("BEGIN");
        // Guardar cabecera de Salida
        const salidaModelRes = await salidaModel.save(client, salidaBean);
        console.log("salidaModelRes[0].id_salida:", salidaModelRes[0].id_salida);
        if(salidaModelRes && salidaModelRes[0].id_salida){
            const ids_salida_detalle = []; 
            const salidaDetalleBeanList = [];
            for(let i=0;i < salida_detalles.length; i++){
                const salidaDetalleBean = new SalidaDetalleBean();
                salidaDetalleBean.salida = { id_salida: salidaModelRes[0].id_salida };
                salidaDetalleBean.producto = { id_producto: salida_detalles[i].id_producto };
                salidaDetalleBean.cantidad = salida_detalles[i].cantidad;
                // Guardar detalle de Salida
                const salidaDetalleModelRes = await salidaDetalleModel.save(client, salidaDetalleBean);
                if(salidaDetalleModelRes && salidaDetalleModelRes[0].id_salida_detalle){
                    ids_salida_detalle.push(salidaDetalleModelRes[0].id_salida_detalle);
                    salidaDetalleBean.id_salida_detalle = salidaDetalleModelRes[0].id_salida_detalle;
                    salidaDetalleBeanList.push(salidaDetalleBean);
                } else {
                    console.log("Error al intentar insertar tsalida_detalle:", salidaDetalleModelRes);
                    await client.query("ROLLBACK");
                    response.resultado = 0;
                    response.mensaje = "Error al insertar tingreso_detalle. "+JSON.stringify(salidaDetalleModelRes);                
                    res.status(200).json(response);
                    return;
                }
            }
            console.log("ids_salida_detalle:", ids_salida_detalle);
            // actualizar stock
            for(let j=0;j < salidaDetalleBeanList.length; j++){
                const productoEnStock = await stockModel.getByIdProductoAndIdLocal(client, salidaDetalleBeanList[j].producto.id_producto, salida.id_local);
                if(productoEnStock.length > 0){
                    // ya existe el producto y local en el stock
                    console.log("ya existe el producto y local en el stock. id_stock: "+productoEnStock[0].id_stock
                    +", id_producto: "+salidaDetalleBeanList[j].producto.id_producto+", id_local:"+salida.id_local);
                    let cantidadParametro = new bigDecimal(salidaDetalleBeanList[j].cantidad);
                    let cantidadAnterior = new bigDecimal(productoEnStock[0].cantidad);
                    let resta = cantidadAnterior.subtract(cantidadParametro);
                    let cero = new bigDecimal("0");
                    if(resta.compareTo(cero) < 0){
                        console.log("No se puede sacar la cantidad = "+cantidadParametro.getValue()+" del id_producto: "+salidaDetalleBeanList[j].producto.id_producto
                        +", en el id_local: "+salida.id_local+", porque en el Stock solo hay cantidad = "+cantidadAnterior.getValue());
                        await client.query("ROLLBACK");
                        response.resultado = 0;
                        response.mensaje = "No se puede sacar la cantidad = "+cantidadParametro.getValue()+" del id_producto: "+salidaDetalleBeanList[j].producto.id_producto
                        +", en el id_local: "+salida.id_local+", porque en el Stock solo hay cantidad = "+cantidadAnterior.getValue();
                        res.status(200).json(response);
                        return;
                    }
                    const stockBean = new StockBean();
                    stockBean.id_stock = productoEnStock[0].id_stock;
                    stockBean.cantidad = resta.getValue();
                    const stockModelRes = await stockModel.updateCantidadById(client, stockBean);
                    if(!stockModelRes){
                        console.log("Error al intentar actualizar el stock. id_stock: "+stockBean.id_stock+", nueva cantidad: "+resta.getValue());
                        await client.query("ROLLBACK");
                        response.resultado = 0;
                        response.mensaje = "Error al intentar actualizar el stock.";                
                        res.status(200).json(response);
                        return;
                    }
                } else {
                    // el producto no existe en el stock
                    /*
                    console.log("el producto no existe en el stock");
                    console.log("salidaDetalleBeanList["+j+"].cantidad:", salidaDetalleBeanList[j].cantidad);
                    console.log("salidaDetalleBeanList["+j+"].producto.id_producto:", salidaDetalleBeanList[j].producto.id_producto);
                    console.log("salida.id_local:", salida.id_local);
                    let cantidadParametro = new bigDecimal(salidaDetalleBeanList[j].cantidad);
                    const stockBean = new StockBean();
                    stockBean.cantidad = cantidadParametro.getValue();
                    stockBean.producto = { id_producto: salidaDetalleBeanList[j].producto.id_producto };
                    stockBean.local = { id_local: salida.id_local };
                    const stockModelRes = await stockModel.save(client, stockBean);
                    if(!stockModelRes){
                        console.log("Error al intentar guardar el stock. id_producto: "+stockBean.producto.id_producto+", id_local:"+salida.id_local+", nueva cantidad: "+cantidadParametro.getValue());
                        await client.query("ROLLBACK");
                        response.resultado = 0;
                        response.mensaje = "Error al intentar actualizar el stock.";                
                        res.status(200).json(response);
                        return;
                    }
                    */
                   // No se pueden sacar productos que no estan en el Stock de Almacen en un determinado Local
                    console.log("No se puede sacar productos que no estan en el Stock de Almacen en un determinado Local. id_producto: "+salidaDetalleBeanList[j].producto.id_producto
                    +", id_local: "+salida.id_local);
                    await client.query("ROLLBACK");
                    response.resultado = 0;
                    response.mensaje = "No se puede sacar productos que no estan en el Stock de Almacen en un determinado Local. id_producto: "+salidaDetalleBeanList[j].producto.id_producto
                    +", id_local: "+salida.id_local;
                    res.status(200).json(response);
                        return;
                }
            }

            if(ids_salida_detalle.length > 0){
                response.resultado = 1;
                response.mensaje = "";
                response.id = salidaModelRes[0].id_salida;
            } else {
                console.log("Error al intentar guardar los detalles de Salida.");
                await client.query("ROLLBACK");
                response.resultado = 0;
                response.mensaje = "Error al intentar los detalles de Salida.";                
                res.status(200).json(response);
                return;
            }
            await client.query('COMMIT')
            res.status(200).json(response);
        } else {
            console.log("Error al intentar guardar la nueva Salida.");
            await client.query("ROLLBACK");
            response.resultado = 0;
            response.mensaje = "Error al intentar guardar la nueva Salida."
            res.status(200).json(response);
            return;
        }
    } catch (error) {
        await client.query("ROLLBACK");
        console.log("Error en salidaService.save:", error);
        res.status(500).send(error);
    } finally {
        client.release();
    }
};

module.exports = salidaService;