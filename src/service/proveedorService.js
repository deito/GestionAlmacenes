const proveedorModel = require('../model/proveedorModel');
const postgresConn = require('../db/postgres');
const constantes = require('../util/constantes');
const ProveedorBean = require('../bean/proveedorBean');
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

proveedorService.save = async (req, res) => {
    try {
        const response = {
            resultado: 0,
            mensaje: "Error inesperado al guardar producto."
        };
        let { tipo_proveedor, tipo_documento, numero_documento, razon_social, telefono, direccion,
            correo, estado, registrado_por } = req.body;
        if(!estado || estado == constantes.emptyString){
            response.resultado = 0;
            response.mensaje = "El campo estado no tiene un valor válido. Tipo de dato: '"+(typeof estado)+"', valor = "+estado;
            res.status(200).json(response);
            return;
        }
        if(!registrado_por){
            response.resultado = 0;
            response.mensaje = "El campo registrado_por no tiene un valor válido. Tipo de dato : '"+(typeof registrado_por)+"', valor = "+registrado_por;
            res.status(200).json(response);
            return;
        }
        const fecha_registro = new Date();
        const proveedorBean = new ProveedorBean(null, tipo_proveedor, tipo_documento, numero_documento, razon_social, telefono, direccion, 
            correo, estado, registrado_por, fecha_registro, null, null);
        const proveedorModelRes = await proveedorModel.save(postgresConn, proveedorBean);
        if(proveedorModelRes && proveedorModelRes[0].id_proveedor){
            response.resultado = 1;
            response.mensaje = "";
            response.id = proveedorModelRes[0].id_proveedor;
        } else {
            response.resultado = 0;
            response.mensaje = "Error al intentar guardar el proveedor."
        }
        res.status(200).json(response);
    } catch (error) {
        console.log("Error en proveedorService.save:", error);
        res.status(500).send(error);
    }
};

module.exports = proveedorService;