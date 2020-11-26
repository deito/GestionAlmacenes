const clienteModel = require('../model/clienteModel');
const postgresConn = require('../db/postgres');
const ClienteBean = require('../bean/clienteBean');
const constantes = require('../util/constantes');
const { connect } = require('..');
const clienteService = {};

clienteService.getAll = async (req, res) => {
    try {
        const response = {
            resultado: 0,
            mensaje: "Error inesperado al obtener clientes."
        };
        const clienteModelRes = await clienteModel.getAll(postgresConn);
        if(clienteModelRes){
            response.resultado = 1;
            response.mensaje = "";
            response.lista_clientes = clienteModelRes;
        }
        res.status(200).json(response);
    } catch (error) {
        console.log("Error en clienteService.getAll,", error);
        res.status(500).send(error);
    }
};

clienteService.save = async (req, res) => {
    try {
        const response = {
            resultado: 0,
            mensaje: "Error inesperado al guardar cliente."
        };
        let { tipo_cliente, tipo_documento, numero_documento, razon_social, telefono, direccion,
            correo, estado, registrado_por } = req.body;
        if(!tipo_cliente){
            tipo_cliente = null;
        }
        if(!tipo_documento){
            tipo_documento = null;
        }
        if(!estado || estado == constantes.emptyString){
            response.resultado = 0;
            response.mensaje = "El campo estado no tiene un valor válido. Tipo de dato: '"+(typeof estado)+"', valor = "+estado;
            res.status(200).json(response);
            return;
        }
        if(!registrado_por){
            response.resultado = 0;
            response.mensaje = "El campo registrado_por no tiene un valor válido. Tipo de dato : '"+(typeof registrado_por)+"', valor = "+registrado_por;
            res.status(200).json(response);
            return;
        }
        const fecha_registro = new Date();
        const clienteBean = new ClienteBean(null, tipo_cliente, tipo_documento, numero_documento, razon_social, telefono, direccion,
            correo, estado, registrado_por, fecha_registro, null, null);
        const clienteModelRes = await clienteModel.save(postgresConn, clienteBean);
        if(clienteModelRes && clienteModelRes[0].id_cliente){
            response.resultado = 1;
            response.mensaje = "";
            response.id = clienteModelRes[0].id_cliente;
        } else {
            response.resultado = 0;
            response.mensaje = "Error al intentar guardar el cliente."
        }
        res.status(200).json(response);
    } catch (error) {
        console.log("Error en clienteService.save:", error);
        res.status(500).send(error);
    }
};

clienteService.getById = async (req, res) => {
    try {
        const response = {
            resultado: 0,
            mensaje: "Error inesperado al buscar cliente por id."
        };
        const { id } = req.query;
        if(!id){
            response.resultado = 0;
            response.mensaje = "El campo id no tiene un valor válido. id = "+id;
        }
        const clienteModelRes = await clienteModel.getById(postgresConn, id);
        if(clienteModelRes && clienteModelRes.length > 0){
            response.resultado = 1;
            response.mensaje = "";
            response.objeto = clienteModelRes[0];
        } else {
            response.resultado = 1;
            response.mensaje = "";
            response.objeto = {};
        }
        res.status(200).json(response);
    } catch (error) {
        console.log("Error en clienteService.getById,", error);
        res.status(500).send(error);
    }
};

clienteService.updateById = async (req, res) => {
    try {
        const response = {
            resultado: 0,
            mensaje: "Error inesperado al actualizar el cliente."
        };

        let { id_cliente, tipo_cliente, tipo_documento, numero_documento, razon_social, telefono, direccion,
            correo, estado, modificado_por } = req.body;
        if(!id_cliente){
            response.resultado = 0;
            response.mensaje = "El id_cliente no tiene un valor válido. Tipo de dato: '"+(typeof id_cliente)+"', valor = "+id_cliente;
            res.status(200).json(response);
            return;
        }
        if(!estado || estado == constantes.emptyString){
            response.resultado = 0;
            response.mensaje = "El estado no tiene un valor válido. Tipo de dato: '"+(typeof estado)+"', valor = "+estado;
            res.status(200).json(response);
            return;
        }
        if(!modificado_por){
            response.resultado = 0;
            response.mensaje = "El campo modificado_por no tiene un valor válido. Tipo de dato: '"+(typeof modificado_por)+"', valor = "+modificado_por;
            res.status(200).json(response);
            return;
        }
        const fecha_modificacion = new Date();
        const clienteBean = new ClienteBean(id_cliente, tipo_cliente, tipo_documento, numero_documento, razon_social, telefono, direccion,
            correo, estado, null, null, modificado_por, fecha_modificacion);
        const clienteModelRes = await clienteModel.updateById(postgresConn, clienteBean);
        if(clienteModelRes){
            response.resultado = 1;
            response.mensaje = "";
        } else {
            response.resultado = 0;
            response.mensaje = "Error al intentar actualizar el Cliente.";
        }
        res.status(200).json(response);
    } catch (error) {
        console.log("Error en clienteService.updateById, ", error);
        res.status(500).send(error);
    }
};

module.exports = clienteService;