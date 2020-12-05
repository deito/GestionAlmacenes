const turnoModel = require('../model/turnoModel');
const postgresConn = require('../db/postgres');
const constantes = require('../util/constantes');
const TurnoBean = require('../bean/turnoBean');
//const UsuarioBean = require('../bean/usuarioBean');
//const LocalBean = require('../bean/localBean');

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

turnoService.startTurno = async (req, res) => {
    try {
        const response = {
            resultado: 0,
            mensaje: "Error inesperado al iniciar Turno."
        };
        let { id_usuario, id_local, accion } = req.body;
        if(!id_usuario){
            response.resultado = 0;
            response.mensaje = "El campo id_usuario no tiene un valor válido. Tipo de dato: '"+(typeof id_usuario)+"', valor = "+id_usuario;
            res.status(200).json(response);
            return;
        }
        if(!id_local){
            response.resultado = 0;
            response.mensaje = "El campo id_local no tiene un valor válido. Tipo de dato: '"+(typeof id_local)+"', valor = "+id_local;
            res.status(200).json(response);
            return;
        }
        if(!accion || accion == constantes.emptyString){
            response.resultado = 0;
            response.mensaje = "El campo accion no tiene un valor válido. Tipo de dato: '"+(typeof accion)+"', valor = "+accion;
            res.status(200).json(response);
            return;
        }
        
        const usuario = { id_usuario: id_usuario};
        const local = { id_local: id_local };
        const turnoBean = new TurnoBean();
        turnoBean.usuario = usuario;
        turnoBean.local = local;
        turnoBean.accion = accion;
        turnoBean.fecha_inicio = new Date();
        const turnoModelRes = await turnoModel.save(postgresConn, turnoBean);
        if(turnoModelRes && turnoModelRes[0].id_turno){
            response.resultado = 1;
            response.mensaje = "";
            response.id = turnoModelRes[0].id_turno;
        } else {
            response.resultado = 0;
            response.mensaje = "Error al intentar guardar el turno."
        }
        res.status(200).json(response);
    } catch (error) {
        console.log("Error en turnoService.startTurno:", error);
        res.status(500).send(error);
    }
};

turnoService.endUpTurno = async (req, res) => {
    try {
        const response = {
            resultado: 0,
            mensaje: "Error inesperado al terminar el Turno."
        };
        let { accion, id_turno } = req.body;
        console.log('accion:', accion);
        if(!accion || accion == constantes.emptyString){
            response.resultado = 0;
            response.mensaje = "El campo accion no tiene un valor válido. Tipo de dato: '"+(typeof accion)+"', valor = "+accion;
            res.status(200).json(response);
            return;
        }
        if(!id_turno){
            response.resultado = 0;
            response.mensaje = "El campo id_turno no tiene un valor válido. Tipo de dato: '"+(typeof id_turno)+"', valor = "+id_turno;
            res.status(200).json(response);
            return;
        }
        const turnoBean = new TurnoBean();
        turnoBean.id_turno = id_turno;
        turnoBean.accion = accion;
        turnoBean.fecha_fin = new Date();
        const turnoModelRes = await turnoModel.updateAccionAndFechaFinByIdTurno(postgresConn, turnoBean);
        if(turnoModelRes){
            response.resultado = 1;
            response.mensaje = "";
        } else {
            response.resultado = 1;
            response.mensaje = "Error al intentar actualizar el Turno.";
        }
        res.status(200).json(response);
    } catch (error) {
        console.log("Error en turnoService.endUpTurno,", error);
        res.status(500).send(error);
    }
};

module.exports = turnoService;