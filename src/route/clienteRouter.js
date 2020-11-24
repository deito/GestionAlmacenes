const router = require('express').Router();

const clienteService = require('../service/clienteService');

// obtener todos los clientes
router.get('/getAll', clienteService.getAll);

module.exports = router;