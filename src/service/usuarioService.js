const SesionBean = require('../bean/sesionBean');
const utility = require('../util/utility');
const usuarioModel = require('../model/usuarioModel');
const sesionModel = require('../model/sesionModel');
const usuarioService = {};
const postgresConn = require('../db/postgres');
const crypto = require('crypto');

usuarioService.save = async (req, res) => {
    try {
        const response = {
            resultado: 0,
            mensaje: "Error inesperado al guardar usuario."
        };

        req.body.fecha_registro = new Date();
        console.log("req.body.fecha_registro:", req.body.fecha_registro);
        console.log("req.body.usuario:", req.body.usuario);
        const usuarioBuscado = await usuarioModel.getByUsuario(postgresConn, req.body.usuario);
        if(usuarioBuscado && usuarioBuscado.length > 0){
            console.log("usuarioBuscado[0].usuario:", usuarioBuscado[0].usuario);
            response.resultado = 0,
            response.mensaje = "El usuario "+usuarioBuscado[0].usuario+" ya existe. Por favor elije otro nombre de usuario."
            res.status(200).json(response);
            return;
        }

        const usuarioModelRes = await usuarioModel.save(postgresConn, req);
        
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
        const response = {
            resultado: 0,
            mensaje: "Error inesperado al hacer login."
        };

        //Buscamos si el usuario y contrasena coinciden
        const usuarioModelRes = await usuarioModel.login(postgresConn, req);
        
        if(usuarioModelRes && usuarioModelRes.length > 0){
            console.log("usuarioModelRes.id_usuario:", usuarioModelRes[0].id_usuario);
            console.log("usuarioModelRes.estado:", usuarioModelRes[0].estado);
            // validar si usuario esta activo
            if(usuarioModelRes[0].estado != 'A'){
                response.resultado = 0;
                response.mensaje = "El usuario no esta activo."
                res.status(200).json(response);
                return;
            }

            // buscar usaurio en tabla de sesion            
            const sesionActual = await sesionModel.getById(postgresConn, usuarioModelRes[0].id_usuario);
            const nuevoToken = crypto.randomBytes(16).toString('hex');
            const dateActual = new Date();
            const sesionBean = new SesionBean(usuarioModelRes[0].id_usuario, nuevoToken, utility.addHoursToDate(1, dateActual));
            if(sesionActual && sesionActual.length > 0){     
                //Si el usuario ya tiene un registro en la tabla de sesion           
                // Actualizar token y fecha de expiracion
                const responseSesionModel = await sesionModel.updateById(postgresConn, sesionBean);
                if(responseSesionModel){
                    response.resultado = 1;
                    response.mensaje = "";
                    response.token = nuevoToken;
                    response.usuario = usuarioModelRes[0];
                } else {
                    response.resultado = 0;
                    response.mensaje = "Error al intentar actualizar los datos de la sesion."
                }
            } else {
                //Si el usuario no tiene registro en la tabla de sesion
                // crear el registro de sesion del usuario
                const responseSesionModel = await sesionModel.save(postgresConn, sesionBean);
                
                if(responseSesionModel && responseSesionModel[0].fecha_expiracion){
                    console.log("responseSesionModel.rows[0].fecha_expiracion:", responseSesionModel[0].fecha_expiracion);
                    response.resultado = 1;
                    response.mensaje = "";
                    response.token = nuevoToken;
                    response.usuario = usuarioModelRes[0];
                } else {
                    response.resultado = 0;
                    response.mensaje = "Error al intentar crear los datos de la sesion."
                }
            }

        } else {
            response.resultado = 0;
            response.mensaje = "El usuario o la contraseña son incorrectas."
        }
        res.status(200).json(response);
    } catch (error) {
        console.log('Error en usuarioService.login,', error);
        res.status(500).send(error);
    }
};

module.exports = usuarioService;