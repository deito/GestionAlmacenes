const stockModel = require('../model/stockModel');
const postgresConn = require('../db/postgres');

const stockService = {};

stockService.getAll = async (req, res) => {
    try {
        const response = {
            resultado: 0,
            mensaje: "Error inesperado al buscar en Stock."
        };
        const stockModelRes = await stockModel.getAll(postgresConn);
        if(stockModelRes){
            response.resultado = 1;
            response.mensaje = "";
            response.lista = stockModelRes;
        } else {
            response.resultado = 0;
            response.mensaje = "Error al momento de buscar el Stock en la base de datos.";
        }
        res.status(200).json(response);
    } catch (error) {
        console.log('Error en stockService.getAll,', error);
        res.status(500).send(error);
    }
};

module.exports = stockService;