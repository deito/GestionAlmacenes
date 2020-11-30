const router = require('express').Router();

const productoService = require('../service/productoService');

// obtener todos los productos
router.get('/getAll', productoService.getAll);

// guardar producto
router.post('/save', productoService.save);

// actualizar producto por id
router.post('/updateById', productoService.updateById);

// obtener producto por id
router.get('/getById', productoService.getById);

// buscar producto por codigo
router.post('/searchByCodigo', productoService.searchByCodigo);

// actualizar producto por id
router.post('/updateEstadoById', productoService.updateEstadoById);

module.exports = router;