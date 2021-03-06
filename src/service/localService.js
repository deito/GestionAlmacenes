const LocalBean = require('../bean/localBean');
const localModel = require('../model/localModel');
const postgresConn = require('../db/postgres');
const usuarioModel = require('../model/usuarioModel');
const constantes = require('../util/constantes');
const localService = {};

localService.save = async (req, res) => {
    try {
        const response = {
            resultado: 0,
            mensaje: "Error inesperado al guardar local."
        };
        let { codigo, nombre, telefono, direccion, estado, registrado_por } = req.body;
        if (!codigo) {
            codigo = null;
        }
        if (!nombre) {
            nombre = null;
        }
        if (!telefono) {
            telefono = null;
        }
        if (!direccion) {
            direccion = null;
        }
        if (!estado) {
            estado = null;
        }
        if (!registrado_por) {
            registrado_por = null;
        }
        
        const fecha_registro = new Date();
        const localBean = new LocalBean(null, codigo, nombre, telefono, direccion, estado, registrado_por, fecha_registro, null, null);
        const localModelRes = await localModel.save(postgresConn, localBean);
        if(localModelRes && localModelRes[0].id_local && localModelRes[0].id_local !=0){
            response.resultado = 1;
            response.mensaje = "";
            response.id_local = localModelRes[0].id_local;
        } else {
            response.resultado = 0;
            response.mensaje = "Error al intentar guardar el local."
        }
        res.status(200).json(response);
    } catch (error) {
        console.log("Error en localService.save:", error);
        res.status(500).send(error);
    }
};

localService.updateById = async (req, res) => {
    try {
        const response = {
            resultado: 0,
            mensaje: "Error inesperado al actualizar Local."
        };
        
        let { id_local, codigo, nombre, telefono, direccion, estado, modificado_por } = req.body;
        console.log("id_local:", id_local);
        if(!id_local || id_local == 0){
            response.resultado = 0;
            response.mensaje = "El id_local no tiene un valor válido. Tipo de dato: '"+(typeof id_local)+"', valor = "+id_local;
            res.status(200).json(response);
            return;
        }
        if(!codigo){
            codigo = null;
        }
        if(!nombre){
            nombre = null;
        }
        if(!telefono){
            telefono = null;
        }
        if(!direccion){
            direccion = null;
        }
        if(!estado){
            estado = null;
        }
        if(!modificado_por || modificado_por == 0){
            response.resultado = 0;
            response.mensaje = "El campo modificado_por no tiene un valor válido.";
            res.status(200).json(response);
            return;
        }
        const fecha_modificacion = new Date();
        const localBean = new LocalBean(id_local, codigo, nombre, telefono, direccion, estado, null, null, modificado_por, fecha_modificacion);
        const responseLocalModel = await localModel.updateById(postgresConn, localBean);
        if(responseLocalModel){
            response.resultado = 1;
            response.mensaje = "";
        } else {
            response.resultado = 0;
            response.mensaje = "Error al intentar actualizar Local.";
        }
        res.status(200).json(response);
    } catch (error) {
        console.log("Error en localService.updateById, ", error);
        res.status(500).send(error);
    }
    
};

localService.getAll = async (req, res) => {
    try {
        const response = {
            resultado: 0,
            mensaje: "Error inesperado al obtener locales."
        };
        const localModelRes = await localModel.getAll(postgresConn);
        if(localModelRes){
            response.resultado = 1;
            response.mensaje = "";
            response.lista_locales = localModelRes;
        }
        res.status(200).json(response);
    } catch (error) {
        console.log('Error en localService.getAll,', error);
        res.status(500).send(error);
    }
};

localService.getById = async (req, res) => {
    try {
        const response = {
            resultado: 0,
            mensaje: "Error inesperado al buscar local por id."
        };
        const { id } = req.query;
        if(!id){
            response.resultado = 0;
            response.mensaje = "El campo id no tiene un valor válido. id = "+id;
        }
        const localModelRes = await localModel.getById(postgresConn, id);
        if(localModelRes && localModelRes.length > 0){
            if(localModelRes.length > 0){
                response.resultado = 1;
                response.mensaje = "";
                response.local = localModelRes[0];
            } else {
                response.resultado = 1;
                response.mensaje = "";
                response.local = {};
            }
        }
        res.status(200).json(response);
    } catch (error) {
        console.log("Error en localService.getById,", error);
        res.status(500).send(error);
    }
};

localService.searchByNombre = async (req, res) => {
    try {
        const response = {
            resultado: 0,
            mensaje: "Error inesperado al buscar locales por nombre."
        };
        const { nombre } = req.body;
        const localModelRes = await localModel.searchByNombre(postgresConn, nombre);
        if(localModelRes){
            response.resultado = 1;
            response.mensaje = "";
            response.lista_locales = localModelRes;
        } else {
            response.resultado = 0;
            response.mensaje = "Error al buscar locales en localModel.searchByNombre .";
        }
        res.status(200).json(response);
    } catch (error) {
        console.log('Error en localService.searchByNombre,', error);
        res.status(500).send(error);
    }
};

localService.updateEstadoById = async (req, res) => {
    try {
        const response = {
            resultado: 0,
            mensaje: "Error inesperado al actualizar el estado del local."
        };
        const { estado, id_local, modificado_por } = req.body;
        if(!id_local || id_local == constantes.emptyString){
            response.resultado = 0;
            response.mensaje = "El campo id_local no tiene un valor válido.";
            res.status(200).json(response);
            return;
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
        const fecha_modificacion = new Date();
        console.log("fecha_modificacion:", fecha_modificacion);
        const localBean = new LocalBean(id_local, null, null, null, null, estado, null, null, modificado_por, fecha_modificacion);
        const localModelRes = await localModel.updateEstadoById(postgresConn, localBean);
        if(localModelRes){
            response.resultado = 1;
            response.mensaje = "";
            response.id_local = id_local;
        }
        res.status(200).json(response);
    } catch (error) {
        console.log('Error en localService.updateEstadoById,', error);
        res.status(500).send(error);
    }
};

module.exports = localService;