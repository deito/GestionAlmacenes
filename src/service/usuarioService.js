const usuarioModel = require('../model/usuarioModel');
const usuarioService = {};
const postgresConn = require('../db/postgres');
const crypto = require('crypto');

usuarioService.save = async (req, res) => {
    try {
        req.body.fecha_registro = new Date();
        console.log("req.body.fecha_registro:", req.body.fecha_registro);
        const usuarioModelRes = await usuarioModel.save(postgresConn, req);
        const response = {
            resultado: 0,
            mensaje: "Error inesperado al guardar usuario."
        };
        if(usuarioModelRes){
            response.resultado = 1;
            response.mensaje = "";
            response.id_usuario = usuarioModelRes[0].id_usuario;
        } else {
            response.resultado = 0;
            response.mensaje = "Error al intentar guardar el usuario."
        }
        res.status(200).json(response);
    } catch (error) {
        console.log('Error en usuarioService.save,', error);
        res.status(500).send(error);
    }
};

usuarioService.login = async (req, res) => {
    try {
        const usuarioModelRes = await usuarioModel.login(postgresConn, req);
        const response = {
            resultado: 0,
            mensaje: "Error inesperado al hacer login."
        };
        if(usuarioModelRes && usuarioModelRes.length > 0){
            const token = crypto.randomBytes(16).toString('hex');
            console.log("token:", token);
            response.resultado = 1;
            response.mensaje = "";
            response.token = token;
            response.usuario = usuarioModelRes[0];
        } else {
            response.resultado = 0;
            response.mensaje = "Error al intentar hacer login."
        }
        res.status(200).json(response);
    } catch (error) {
        console.log('Error en usuarioService.login,', error);
        res.status(500).send(error);
    }
};

module.exports = usuarioService;