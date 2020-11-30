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

proveedorService.getById = async (req, res) => {
    try {
        const response = {
            resultado: 0,
            mensaje: "Error inesperado al buscar proveedor por id."
        };
        const { id } = req.query;
        if(!id){
            response.resultado = 0;
            response.mensaje = "El campo id no tiene un valor válido. id = "+id;
        }
        const proveedorModelRes = await proveedorModel.getById(postgresConn, id);
        if(proveedorModelRes){
            response.resultado = 1;
            response.mensaje = "";
            if(proveedorModelRes.length > 0){
                response.objeto = proveedorModelRes[0];
            } else {
                response.objeto = {};
            }
        }
        res.status(200).json(response);
    } catch (error) {
        console.log("Error en proveedorService.getById,", error);
        res.status(500).send(error);
    }
};

proveedorService.updateById = async (req, res) => {
    try {
        const response = {
            resultado: 0,
            mensaje: "Error inesperado al actualizar el proveedor."
        };
        let { id_proveedor, tipo_proveedor, tipo_documento, numero_documento, razon_social, telefono, direccion,
            correo, estado, modificado_por } = req.body;
        if(!id_proveedor){
            response.resultado = 0;
            response.mensaje = "El id_proveedor no tiene un valor válido. Tipo de dato: '"+(typeof id_proveedor)+"', valor = "+id_proveedor;
            res.status(200).json(response);
            return;
        }
        if(!estado || estado == constantes.emptyString){
            response.resultado = 0;
            response.mensaje = "El estado no tiene un valor válido. Tipo de dato: '"+(typeof estado)+"', valor = "+estado;
            res.status(200).json(response);
            return;
        }
        if(!modificado_por){
            response.resultado = 0;
            response.mensaje = "El campo modificado_por no tiene un valor válido. Tipo de dato: '"+(typeof modificado_por)+"', valor = "+modificado_por;
            res.status(200).json(response);
            return;
        }
        const fecha_modificacion = new Date();
        const proveedorBean = new ProveedorBean(id_proveedor, tipo_proveedor, tipo_documento, numero_documento, razon_social, telefono, direccion, correo,
            estado, null, null, modificado_por, fecha_modificacion);
        const proveedorModelRes = await proveedorModel.updateById(postgresConn, proveedorBean);
        if(proveedorModelRes){
            response.resultado = 1;
            response.mensaje = "";
        } else {
            response.resultado = 1;
            response.mensaje = "Error al intentar actualizar el Proveedor.";
        }
        res.status(200).json(response);
    } catch (error) {
        console.log("Error en proveedorService.updateById,", error);
        res.status(500).send(error);
    }
};

proveedorService.searchByRazonSocialAndTipoProveedor = async (req, res) => {
    try {
        const response = {
            resultado: 0,
            mensaje: "Error inesperado al buscar proveedores."
        };
        let { razon_social, tipo_proveedor } = req.body;
        console.log("razon_social:", razon_social);
        if(!razon_social){
            razon_social = null;
        }
        console.log("tipo_proveedor:", tipo_proveedor);
        if(!tipo_proveedor){
            tipo_proveedor = null;
        }
        const proveedorBean = new ProveedorBean(null, tipo_proveedor, null, null, razon_social, null, null, null, null, null, null, null, null);
        const proveedorModelRes = await proveedorModel.searchByRazonSocialAndTipoProveedor(postgresConn, proveedorBean);
        if(proveedorModelRes){
            response.resultado = 1;
            response.mensaje = "";
            response.lista = proveedorModelRes;
        } else {
            response.resultado = 0;
            response.mensaje = "Error al buscar clientes por razon social y tipo de proveedor.";
        }
        res.status(200).json(response);
    } catch (error) {
        console.log('Error en proveedorService.searchByRazonSocialAndTipoProveedor,', error);
        res.status(500).send(error);
    }
};

proveedorService.updateEstadoById = async (req, res) => {
    try {
        const response = {
            resultado: 0,
            mensaje: "Error inesperado al actualizar el estado del proveedor por id."
        };
        const { estado, id_proveedor, modificado_por } = req.body;
        if(!id_proveedor || id_proveedor == constantes.emptyString){
            response.resultado = 0;
            response.mensaje = "El campo id_proveedor no tiene un valor válido. Tipo de dato: '"+(typeof id_proveedor)+"', valor = "+id_proveedor;
            res.status(200).json(response);
            return;
        }
        if(!estado || estado == constantes.emptyString){
            response.resultado = 0;
            response.mensaje = "El campo estado no tiene un valor válido. Tipo de dato: '"+(typeof estado)+"', valor = "+estado;
            res.status(200).json(response);
            return;
        }
        if(!modificado_por || modificado_por == constantes.emptyString){
            response.resultado = 0;
            response.mensaje = "El campo modificado_por no tiene un valor válido. Tipo de dato: '"+(typeof modificado_por)+"', valor = "+modificado_por;
            res.status(200).json(response);
            return;
        }
        const fecha_modificacion = new Date();
        const proveedorBean = new ProveedorBean(id_proveedor, null, null, null, null, null, null, null, estado, null, null, modificado_por, fecha_modificacion);
        const proveedorModelRes = await proveedorModel.updateEstadoById(postgresConn, proveedorBean);
        if(proveedorModelRes){
            response.resultado = 1;
            response.mensaje = "";
            response.id = id_proveedor;
        } else {
            response.resultado = 0;
            response.mensaje = "Error al actualizar el estado del proveedor por id.";
        }
        res.status(200).json(response);
    } catch (error) {
        console.log('Error en proveedorService.updateEstadoById,', error);
        res.status(500).send(error);
    }
};

module.exports = proveedorService;