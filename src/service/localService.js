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

module.exports = localService;