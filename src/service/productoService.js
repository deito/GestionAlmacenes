const productoModel = require('../model/productoModel');
const postgresConn = require('../db/postgres');
const productoService = {};

productoService.getAll = async (req, res) => {
    try {
        const response = {
            resultado: 0,
            mensaje: "Error inesperado al obtener productos."
        };
        const productoModelRes = await productoModel.getAll(postgresConn);
        if(productoModelRes){
            response.resultado = 1;
            response.mensaje = "";
            response.lista_productos = productoModelRes;
        }
        res.status(200).json(response);
    } catch (error) {
        console.log("Error en productoService.getAll,", error);
        res.status(500).send(error);
    }
};

module.exports = productoService;