const router = require('express').Router();

const clienteService = require('../service/clienteService');

// obtener todos los clientes
router.get('/getAll', clienteService.getAll);

// guardar nuevi Cliente
router.post('/save', clienteService.save);

// obtener cliente por id
router.get('/getById', clienteService.getById);

// actualizar por id
router.post('/updateById', clienteService.updateById);

// buscar por razon social y tipo de cliente
router.post('/searchByRazonSocialAndTipoCliente',clienteService.searchByRazonSocialAndTipoCliente);

// actualizar estado por id
router.post('/updateEstadoById', clienteService.updateEstadoById);

module.exports = router;