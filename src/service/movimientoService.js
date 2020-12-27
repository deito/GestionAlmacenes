const { request } = require('express');
const bigDecimal = require('js-big-decimal');
const movimientoModel = require('../model/movimientoModel');
const postgresConn = require('../db/postgres');
const constantes = require('../util/constantes');
const utility = require('../util/utility');

const movimientoService = {};

movimientoService.countRowsByFilters = async (req, res) => {
    try {
        const response = {
            resultado: 0,
            mensaje: "Error inesperado al contar Movimientos."
        };
        let { id_tipo_movimiento, id_local, id_tipo_operacion, fecha_inicio, fecha_fin } = req.body;
        // Inicio: Validando filtros
        if(!fecha_inicio || fecha_inicio==constantes.emptyString || !utility.validateStringDateYYYYMMDD(fecha_inicio)){
            const mensaje = "El campo fecha_inicio no tiene un valor válido. Tipo de dato: '"+(typeof fecha_inicio)+"', valor = "+fecha_inicio;
            console.log(mensaje);
            response.resultado = 0;
            response.mensaje = mensaje;
            res.status(200).json(response);
            return;
        }
        if(!fecha_fin || fecha_fin==constantes.emptyString || !utility.validateStringDateYYYYMMDD(fecha_fin)){
            const mensaje = "El campo fecha_fin no tiene un valor válido. Tipo de dato: '"+(typeof fecha_fin)+"', valor = "+fecha_fin;
            console.log(mensaje);
            response.resultado = 0;
            response.mensaje = mensaje;
            res.status(200).json(response);
            return;
        }
        // Fin: Validando filtros
        const movimientoModelRes = await movimientoModel.countRowsByFilters(postgresConn, req.body);
        if(movimientoModelRes){
            response.resultado = 1;
            response.mensaje = "";
            response.cantidad = movimientoModelRes[0].cantidad;
        } else {
            response.resultado = 0;
            response.mensaje = "Error al momento de contar Movimientos en la base de datos.";
        }
        res.status(200).json(response);
    } catch (error) {
        console.log("Error en movimientoService.countRowsByFilters,", error);
        res.status(500).send(error);
    }
};

movimientoService.searchByFilters = async (req, res) => {
    try {
        const response = {
            resultado: 0,
            mensaje: "Error inesperado al buscar Movimientos."
        };
        let { id_tipo_movimiento, fecha_inicio, fecha_fin, id_local, id_tipo_operacion, 
            cantidad_filas, pagina } = req.body;
        // Inicio: Validando filtros
        // Si es un valor valido(es decir no es: undefined, NaN, null) y, no es un numero o su valor es menor que 1
        if(id_tipo_movimiento && (!parseInt(id_tipo_movimiento) || id_tipo_movimiento < 1)){
            const mensaje = "El campo id_tipo_movimiento no tiene un valor válido. Tipo de dato: '"+(typeof id_tipo_movimiento)+"', valor = "+id_tipo_movimiento;
            console.log(mensaje);
            response.resultado = 0;
            response.mensaje = mensaje;
            res.status(200).json(response);
            return;
        }
        if(id_tipo_operacion && (!parseInt(id_tipo_operacion) || id_tipo_operacion < 1)){
            const mensaje = "El campo id_tipo_operacion no tiene un valor válido. Tipo de dato: '"+(typeof id_tipo_operacion)+"', valor = "+id_tipo_operacion;
            console.log(mensaje);
            response.resultado = 0;
            response.mensaje = mensaje;
            res.status(200).json(response);
            return;
        }
        if(!fecha_inicio || fecha_inicio==constantes.emptyString || !utility.validateStringDateYYYYMMDD(fecha_inicio)){
            const mensaje = "El campo fecha_inicio no tiene un valor válido. Tipo de dato: '"+(typeof fecha_inicio)+"', valor = "+fecha_inicio;
            console.log(mensaje);
            response.resultado = 0;
            response.mensaje = mensaje;
            res.status(200).json(response);
            return;
        }
        if(!fecha_fin || fecha_fin==constantes.emptyString || !utility.validateStringDateYYYYMMDD(fecha_fin)){
            const mensaje = "El campo fecha_fin no tiene un valor válido. Tipo de dato: '"+(typeof fecha_fin)+"', valor = "+fecha_fin;
            console.log(mensaje);
            response.resultado = 0;
            response.mensaje = mensaje;
            res.status(200).json(response);
            return;
        }
        if(id_local && (!parseInt(id_local) || id_local < 1)){
            const mensaje = "El campo id_local no tiene un valor válido. Tipo de dato: '"+(typeof id_local)+"', valor = "+id_local;
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
        req.body.pagina = pagina - 1;
        const movimientoModelRes = await movimientoModel.searchByFilters(postgresConn, req.body);
        if(movimientoModelRes){
            response.resultado = 1;
            response.mensaje = "";
            response.lista = movimientoModelRes;
        } else {
            response.resultado = 0;
            response.mensaje = "Error al momento de buscar Movimientos en la base de datos.";
        }
        res.status(200).json(response);
    } catch (error) {
        console.log("Error en movimientoService.searchByFilters,", error);
        res.status(500).send(error);
    }
};

module.exports = movimientoService;