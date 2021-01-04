const stockModel = require('../model/stockModel');
const postgresConn = require('../db/postgres');
const utility = require('../util/utility');

const stockService = {};

stockService.getAll = async (req, res) => {
    try {
        const response = {
            resultado: 0,
            mensaje: "Error inesperado al buscar en Stock."
        };
        const stockModelRes = await stockModel.getAll(postgresConn);
        if(stockModelRes){
            response.resultado = 1;
            response.mensaje = "";
            response.lista = stockModelRes;
        } else {
            response.resultado = 0;
            response.mensaje = "Error al momento de buscar el Stock en la base de datos.";
        }
        res.status(200).json(response);
    } catch (error) {
        console.log('Error en stockService.getAll,', error);
        res.status(500).send(error);
    }
};

stockService.countRowsByFilters = async (req, res) => {
    try {
        const response = {
            resultado: 0,
            mensaje: "Error inesperado al contar Stock."
        };
        let { id_local, id_producto } = req.body;
        // Inicio: Validando filtros
        // Si es un valor valido(es decir no es: undefined, NaN, null) y, no es un numero o su valor es menor que 1
        if(id_local && (!parseInt(id_local) || id_local < 1)){
            const mensaje = "El campo id_local no tiene un valor válido. Tipo de dato: '"+(typeof id_local)+"', valor = "+id_local;
            console.log(mensaje);
            response.resultado = 0;
            response.mensaje = mensaje;
            res.status(200).json(response);
            return;
        }
        if(id_producto && (!parseInt(id_producto) || id_producto < 1)){
            const mensaje = "El campo id_producto no tiene un valor válido. Tipo de dato: '"+(typeof id_producto)+"', valor = "+id_producto;
            console.log(mensaje);
            response.resultado = 0;
            response.mensaje = mensaje;
            res.status(200).json(response);
            return;
        }
        // Fin: Validando filtros
        const stockModelRes = await stockModel.countRowsByFilters(postgresConn, req.body);
        if(stockModelRes){
            response.resultado = 1;
            response.mensaje = "";
            response.cantidad = stockModelRes[0].cantidad;
        } else {
            response.resultado = 0;
            response.mensaje = "Error al momento de contar Productos en Stock en la base de datos.";
        }
        res.status(200).json(response);
    } catch (error) {
        console.log("Error en stockService.countRowsByFilters,", error);
        res.status(500).send(error);
    }
};

stockService.searchByFilters = async (req, res) => {
    try {
        const response = {
            resultado: 0,
            mensaje: "Error inesperado al buscar en Stock."
        };
        let { id_local, id_producto, cantidad_filas, pagina } = req.body;
        // Inicio: Validando filtros
        // Si es un valor valido(es decir no es: undefined, NaN, null) y, no es un numero o su valor es menor que 1
        if(id_local && (!parseInt(id_local) || id_local < 1)){
            const mensaje = "El campo id_local no tiene un valor válido. Tipo de dato: '"+(typeof id_local)+"', valor = "+id_local;
            console.log(mensaje);
            response.resultado = 0;
            response.mensaje = mensaje;
            res.status(200).json(response);
            return;
        }
        if(id_producto && (!parseInt(id_producto) || id_producto < 1)){
            const mensaje = "El campo id_producto no tiene un valor válido. Tipo de dato: '"+(typeof id_producto)+"', valor = "+id_producto;
            console.log(mensaje);
            response.resultado = 0;
            response.mensaje = mensaje;
            res.status(200).json(response);
            return;
        }
        if(!utility.isNumericValue(cantidad_filas) || cantidad_filas < 1){
            const mensaje = "El campo cantidad_filas no tiene un valor válido. Tipo de dato: '"+(typeof cantidad_filas)+"', valor = "+cantidad_filas;
            console.log(mensaje);
            response.resultado = 0;
            response.mensaje = mensaje;
            res.status(200).json(response);
            return;
        }
        if(!utility.isNumericValue(pagina) || pagina < 1){
            const mensaje = "El campo pagina no tiene un valor válido. Tipo de dato: '"+(typeof pagina)+"', valor = "+pagina;
            console.log(mensaje);
            response.resultado = 0;
            response.mensaje = mensaje;
            res.status(200).json(response);
            return;
        }
        // Fin: Validando filtros
        const stockModelRes = await stockModel.searchByFilters(postgresConn, req.body);
        if(stockModelRes){
            response.resultado = 1;
            response.mensaje = "";
            response.lista = stockModelRes;
        } else {
            response.resultado = 0;
            response.mensaje = "Error al momento de buscar Stock en la base de datos.";
        }
        res.status(200).json(response);
    } catch (error) {
        console.log("Error en stockService.searchByFilters,", error);
        res.status(500).send(error);
    }
};

module.exports = stockService;