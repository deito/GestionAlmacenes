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
            response.lista_productos = productoModelRes;
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

module.exports = productoService;