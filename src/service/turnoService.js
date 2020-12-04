const turnoModel = require('../model/turnoModel');
const postgresConn = require('../db/postgres');
const constantes = require('../util/constantes');

const turnoService = {};

turnoService.searchLastTurnoByIdUsuarioAndIdLocal = async (req, res) => {
    try {
        const response = {
            resultado: 0,
            mensaje: "Error inesperado al buscar el último Turno del Usuario."
        };
        const { id_usuario, id_local } = req.body;
        const turnoModelRes = await turnoModel.searchLastTurnoByIdUsuarioAndIdLocal(postgresConn, id_usuario, id_local);
        if(turnoModelRes){
            if(turnoModelRes.length > 0){
                response.resultado = 1;
                response.mensaje = "";
                response.objeto = turnoModelRes[0];
            } else {
                response.resultado = 1;
                response.mensaje = "";
                response.objeto = {};
            }
        } else {
            response.resultado = 0;
            response.mensaje = "Error al momento de buscar el último Turno del Usuario.";
        }
        res.status(200).json(response);
    } catch (error) {
        console.log('Error en turnoService.searchLastTurnoByIdUsuarioAndIdLocal,', error);
        res.status(500).send(error);
    }
};

module.exports = turnoService;