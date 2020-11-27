const proveedorModel = require('../model/proveedorModel');
const postgresConn = require('../db/postgres');
const constantes = require('../util/constantes');
const proveedorService = {};

proveedorService.getAll =async (req, res) => {
    try {
        const response = {
            resultado: 0,
            mensaje: "Error inesperado al obtener proveedores."
        };
        const proveedorModelRes = await proveedorModel.getAll(postgresConn);
        if(proveedorModelRes){
            response.resultado = 1;
            response.mensaje = "";
            response.lista = proveedorModelRes;
        }
        res.status(200).json(response);
    } catch (error) {
        console.log("Error en proveedorService.getAll,", error);
        res.status(500).send(error);
    }
};

module.exports = proveedorService;