const SesionBean = require('../bean/sesionBean');
const LocalBean = require('../bean/localBean');
const RolBean = require('../bean/rolBean');
const UsuarioBean = require('../bean/usuarioBean');
const utility = require('../util/utility');
const usuarioModel = require('../model/usuarioModel');
const sesionModel = require('../model/sesionModel');
const usuarioService = {};
const postgresConn = require('../db/postgres');
const crypto = require('crypto');
const constantes = require('../util/constantes');
const { connect } = require('http2');

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

        let { id_local, nombres, apellidos, usuario, contrasena, id_rol, tipo_documento, numero_documento, telefono, estado, registrado_por, fecha_registro } = req.body;
        console.log("id_local: "+id_local);
        if(!id_local){
            id_local = null;
        }
        console.log("nombres: "+nombres);
        if(!nombres){
            nombres = null;
        }
        console.log("apellidos: "+apellidos);
        if(!apellidos){
            apellidos = null;
        }
        console.log("usuario: "+usuario);
        if(!usuario || usuario == null || usuario == constantes.emptyString){
            response.resultado = 0;
            response.mensaje = "El campo usuario no tiene un valor válido.";
            res.status(200).json(response);
            return;
        }
        console.log("contrasena: "+contrasena);
        if(!contrasena || contrasena == null || contrasena == constantes.emptyString){
            response.resultado = 0;
            response.mensaje = "La contraseña no tiene un valor válido.";
            res.status(200).json(response);
            return;
        }
        console.log("id_rol: "+id_rol);
        if(!id_rol){
            id_rol = null;
        }
        console.log("tipo_documento: "+tipo_documento);
        if(!tipo_documento){
            tipo_documento = null;
        }
        console.log("numero_documento: "+numero_documento);
        if(!numero_documento){
            numero_documento = null;
        }
        console.log("telefono: "+telefono);
        if(!telefono){
            telefono = null;
        }
        console.log("estado: "+estado);
        if(!estado){
            estado = null;
        }
        console.log("registrado_por: "+registrado_por);
        if(!registrado_por){
            registrado_por = null;
        }
        console.log("fecha_registro: "+fecha_registro);
        if(!fecha_registro){
            fecha_registro = null;
        }

        const localBean = new LocalBean(id_local, null, null, null, null, null, null, null, null, null);
        const rolBean = new RolBean(id_rol, null, null);
        const usuarioBean = new UsuarioBean(null, localBean, nombres, apellidos, usuario, contrasena, rolBean, tipo_documento,
            numero_documento, telefono, estado, registrado_por, fecha_registro, null, null);

        const usuarioModelRes = await usuarioModel.save(postgresConn, usuarioBean);
        
        if(usuarioModelRes && usuarioModelRes[0].id_usuario && usuarioModelRes[0].id_usuario != 0){
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
                    console.log("responseSesionModel[0].fecha_expiracion:", responseSesionModel[0].fecha_expiracion);
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

usuarioService.getAll = async (req, res) => {
    try {
        const response = {
            resultado: 0,
            mensaje: "Error inesperado al obtener usuarios."
        };
        const usuarioModelRes = await usuarioModel.getAll(postgresConn);
        if(usuarioModelRes){
            response.resultado = 1;
            response.mensaje = "";
            response.lista_usuarios = usuarioModelRes;
        }
        res.status(200).json(response);
    } catch (error) {
        console.log('Error en usuarioService.getAll,', error);
        res.status(500).send(error);
    }
};

usuarioService.updateById = async (req, res) => {
    try {
        const response = {
            resultado: 0,
            mensaje: "Error desconocido al actualizar el usuario."
        };
        let { id_usuario, id_local, nombres, apellidos, contrasena, id_rol, tipo_documento, numero_documento, telefono, estado, modificado_por } = req.body;
        
        console.log("id_usuario: "+id_usuario);
        if(!id_usuario || id_usuario == constantes.emptyString){
            response.resultado = 0;
            response.mensaje = "El id_usuario no tiene un valor válido."
            res.status(200).json(response);
            return;
        }
        if(!id_local){
            id_local = null;
        }
        if(!nombres){
            nombres = null;
        }
        if(!apellidos){
            apellidos = null;
        }
        console.log("contrasena: "+contrasena);
        if(!contrasena || contrasena == constantes.emptyString){
            contrasena = null;
        }
        if(!id_rol){
            id_rol = null;
        }
        if(!tipo_documento){
            tipo_documento = null;
        }
        if(!numero_documento){
            numero_documento = null;
        }
        if(!telefono){
            telefono = null;
        }
        if(!estado || estado == constantes.emptyString){
            response.resultado = 0;
            response.mensaje = "El campo estado no tiene un valor válido.";
            res.status(200).json(response);
            return;
        }
        if(!modificado_por || modificado_por == constantes.emptyString){
            response.resultado = 0;
            response.mensaje = "El campo modificado_por no tiene un valor válido.";
            res.status(200).json(response);
            return;
        }
        let fecha_modificacion = new Date();
        const localBean = new LocalBean(id_local, null, null, null, null, null, null, null, null, null);
        const rolBean = new RolBean(id_rol, null, null);
        const usuarioBean = new UsuarioBean(id_usuario, localBean, nombres, apellidos, null, contrasena, rolBean,
            tipo_documento, numero_documento, telefono, estado, null, null, modificado_por, fecha_modificacion);
        const usuarioModelRes = await usuarioModel.updateById(postgresConn, usuarioBean);
        if(usuarioModelRes){
            response.resultado = 1;
            response.mensaje = "";
            response.id_usuario = id_usuario;
        } else {
            response.resultado = 0;
            response.mensaje = "Error al intentar actualizar el usuario.";
        }
        res.status(200).json(response);
    } catch (error) {
        console.log('Error en usuarioService.updateById,', error);
        res.status(500).send(error);
    }
};

usuarioService.searchByUsuarioAndIdRol = async (req, res) => {
    try {
        const response = {
            resultado: 0,
            mensaje: "Error inesperado al buscar usuarios."
        };
        let { usuario, id_rol } = req.body;
        console.log("usuario:", usuario);
        if(!usuario){
            usuario = null;
        }
        console.log("id_rol:", id_rol);
        if(!id_rol){
            id_rol = null;
        }
        const rolBean = new RolBean(id_rol, null, null);
        const usuarioBean = new UsuarioBean(null, null, null, null, usuario, null, rolBean, null, null, null,
            null, null, null, null, null);
        
        const usuarioModelRes = await usuarioModel.searchByUsuarioAndIdRol(postgresConn, usuarioBean);
        if(usuarioModelRes){
            response.resultado = 1;
            response.mensaje = "";
            response.lista_usuarios = usuarioModelRes;
        } else {
            response.resultado = 0;
            response.mensaje = "Error al buscar usaurios."
        }
        res.status(200).json(response);
    } catch (error) {
        console.log('Error en usuarioService.searchByUsuarioAndIdRol,', error);
        res.status(500).send(error);
    }
};

usuarioService.getById = async (req, res) => {
    try {
        const response = {
            resultado: 0,
            mensaje: "Error inesperado al buscar usuario."
        };
        const { id } = req.query;
        if(!id){
            response.resultado = 0;
            response.mensaje = "El campo id no tiene un valor válido. id = "+id;
        }
        const usuarioModelRes = await usuarioModel.getById(postgresConn, id);
        if(usuarioModelRes){
            response.resultado = 1;
            response.mensaje = "";
            usuarioModelRes[0].contrasena = null;
            response.usuario = usuarioModelRes[0];
        }
        res.status(200).json(response);
    } catch (error) {
        console.log('Error en usuarioService.getById,', error);
        res.status(500).send(error);
    }
};

module.exports = usuarioService;