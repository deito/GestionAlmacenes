const clienteModel = require('../model/clienteModel');
const postgresConn = require('../db/postgres');
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

module.exports = clienteService;