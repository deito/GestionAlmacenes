const router = require('express').Router();

const proveedorService = require('../service/proveedorService');

// obtener todos
router.get('/getAll', proveedorService.getAll);

// crear nuevo, guardar
router.post('/save', proveedorService.save);

// obtener por id
router.get('/getById', proveedorService.getById);

// actualizar por id
router.post('/updateById', proveedorService.updateById);

// buscar por razon social y tipo de proveedor
router.post('/searchByRazonSocialAndTipoProveedor', proveedorService.searchByRazonSocialAndTipoProveedor);

// actualizar estado por id
router.post('/updateEstadoById', proveedorService.updateEstadoById);

module.exports = router;