const usuarioModel = require('../model/usuarioModel');
const usuarioService = {};
const postgresConn = require('../db/postgres');

usuarioService.save = async (req, res) => {
    try {
        req.body.fecha_registro = new Date();
        console.log("req.body.fecha_registro:", req.body.fecha_registro);
        const usuarioModelRes = await usuarioModel.save(postgresConn, req);
        const response = {
            resultado: 0,
            mensaje: "Error inesperado."
        };
        if(usuarioModelRes){
            response.mensaje = 1;
            response.mensaje = "";
            response.id_usuario = usuarioModelRes.id_usuario;
        } else {
            response.resultado = 0;
            response.mensaje = "Error al intentar guardar el usuario."
        }
        res.status(200).json(response);
    } catch (error) {
        console.log('Error en usuarioService.save,', error);
        res.status(500).send(error);
    }
}

module.exports = usuarioService;