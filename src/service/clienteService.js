const clienteModel = require('../model/clienteModel');
const postgresConn = require('../db/postgres');
const ClienteBean = require('../bean/clienteBean');
const constantes = require('../util/constantes');
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
        if(!registrado_por){
            registrado_por = null;
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

module.exports = clienteService;