const LocalBean = require('../bean/localBean');
const localModel = require('../model/localModel');
const postgresConn = require('../db/postgres');
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
        
        fecha_registro = new Date();
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
        
        let { id_local, codigo, nombre, telefono, direccion, estado, modificado_por, fecha_modificacion } = req.body;
        console.log("id_local:", id_local);
        if(!id_local || id_local == 0){
            response.resultado = 0;
            response.mensaje = "El id_local no tiene un valor válido.";
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
        fecha_modificacion = new Date();
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
        if(localModelRes){
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

module.exports = localService;