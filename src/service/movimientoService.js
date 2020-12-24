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

module.exports = movimientoService;