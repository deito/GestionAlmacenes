const rolModel = require('../model/rolModel');
const postgresConn = require('../db/postgres');
const rolService = {};

rolService.getAll = async (req, res) => {
    try {
        const response = {
            resultado: 0,
            mensaje: "Error inesperado al obtener roles."
        };
        const rolModelRes = await rolModel.getAll(postgresConn);
        if(rolModelRes){
            response.resultado = 1;
            response.mensaje = "";
            response.lista_roles = rolModelRes;
        }
        res.status(200).json(response);
    } catch (error) {
        console.log('Error en rolService.getAll,', error);
        res.status(500).send(error);
    }
};

module.exports = rolService;