const router = require('express').Router();

const clienteService = require('../service/clienteService');

// obtener todos los clientes
router.get('/getAll', clienteService.getAll);

// guardar nuevi Cliente
router.post('/save', clienteService.save);

// obtener cliente por id
router.get('/getById', clienteService.getById);

module.exports = router;