const productoModel = require('../model/productoModel');
const postgresConn = require('../db/postgres');
const ProductoBean = require('../bean/productoBean');
const constantes = require('../util/constantes');
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
            response.lista = productoModelRes;
        }
        res.status(200).json(response);
    } catch (error) {
        console.log("Error en productoService.getAll,", error);
        res.status(500).send(error);
    }
};

productoService.save = async (req, res) => {
    try {
        const response = {
            resultado: 0,
            mensaje: "Error inesperado al guardar producto."
        };
        let { codigo, nombre, marca, talla, color, precio_venta, estado,
            registrado_por } = req.body;
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
        const productoBean = new ProductoBean(null, codigo, nombre, marca, talla, color, precio_venta, estado, registrado_por, fecha_registro, null, null);
        const productoModelRes = await productoModel.save(postgresConn, productoBean);
        if(productoModelRes && productoModelRes[0].id_producto){
            response.resultado = 1;
            response.mensaje = "";
            response.id = productoModelRes[0].id_producto;
        } else {
            response.resultado = 0;
            response.mensaje = "Error al intentar guardar el producto."
        }
        res.status(200).json(response);
    } catch (error) {
        console.log("Error en productoService.save:", error);
        res.status(500).send(error);
    }
};

productoService.updateById = async (req, res) => {
    try {
        const response = {
            resultado: 0,
            mensaje: "Error inesperado al actualizar el producto."
        };
        let { id_producto, codigo, nombre, marca, talla, color, precio_venta, estado,
            modificado_por } = req.body;
        if(!id_producto){
            response.resultado = 0;
            response.mensaje = "El id_producto no tiene un valor válido. Tipo de dato: '"+(typeof id_producto)+"', valor = "+id_producto;
            res.status(200).json(response);
            return;
        }
        if(!codigo || codigo == constantes.emptyString){
            response.resultado = 0;
            response.mensaje = "El codigo no tiene un valor válido. Tipo de dato: '"+(typeof codigo)+"', valor = "+codigo;
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
        const productoBean = new ProductoBean(id_producto, codigo, nombre, marca, talla, color, precio_venta, estado, null, null,
            modificado_por, fecha_modificacion);
        const productoModelRes = await productoModel.updateById(postgresConn, productoBean);
        if(productoModelRes){
            response.resultado = 1;
            response.mensaje = "";
        } else {
            response.resultado = 1;
            response.mensaje = "Error al intentar actualizar el Producto";
        }
        res.status(200).json(response);
    } catch (error) {
        console.log("Error en productoService.updateById,", error);
        res.status(500).send(error);
    }
};

productoService.getById = async (req, res) => {
    try {
        const response = {
            resultado: 0,
            mensaje: "Error inesperado al buscar producto por id."
        };
        const { id } = req.query;
        if(!id){
            response.resultado = 0;
            response.mensaje = "El campo id no tiene un valor válido. id = "+id;
        }
        const productoModelRes = await productoModel.getById(postgresConn, id);
        if(productoModelRes && productoModelRes.length > 0){
            response.resultado = 1;
            response.mensaje = "";
            response.objeto = productoModelRes[0];
        } else {
            response.resultado = 1;
            response.mensaje = "";
            response.objeto = {};
        }
        res.status(200).json(response);
    } catch (error) {
        console.log("Error en productoService.getById,", error);
        res.status(500).send(error);
    }
};

productoService.searchByCodigo = async (req, res) => {
    try {
        const response = {
            resultado: 0,
            mensaje: "Error inesperado al buscar productos por codigo."
        };
        const { codigo } = req.body;
        const productoModelRes = await productoModel.searchByCodigo(postgresConn, codigo);
        if(productoModelRes){
            response.resultado = 1;
            response.mensaje = "";
            response.lista = productoModelRes;
        } else {
            response.resultado = 0;
            response.mensaje = "Error al buscar productos por codigo.";
        }
        res.status(200).json(response);
    } catch (error) {
        console.log('Error en productoService.searchByCodigo,', error);
        res.status(500).send(error);
    }
};

productoService.updateEstadoById = async (req, res) => {
    try {
        const response = {
            resultado: 0,
            mensaje: "Error inesperado al actualizar el estado del producto por id."
        };
        const { estado, id_producto, modificado_por } = req.body;
        if(!id_producto || id_producto == constantes.emptyString){
            response.resultado = 0;
            response.mensaje = "El campo id_producto no tiene un valor válido. Tipo de dato: '"+(typeof id_producto)+"', valor = "+id_producto;
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
        const productoBean = new ProductoBean(id_producto, null, null, null, null, null, null, estado, null, null, modificado_por, fecha_modificacion);
        const productoModelRes = await productoModel.updateEstadoById(postgresConn, productoBean);
        if(productoModelRes){
            response.resultado = 1;
            response.mensaje = "";
            response.id = id_producto;
        } else {
            response.resultado = 0;
            response.mensaje = "Error al actualizar el estado del producto por id.";
        }
        res.status(200).json(response);
    } catch (error) {
        console.log('Error en productoService.updateEstadoById,', error);
        res.status(500).send(error);
    }
};

module.exports = productoService;