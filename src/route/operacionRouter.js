const router = require('express').Router();

const operacionService = require('../service/operacionService');

// obtener los Tipos de Operacion
router.get('/getAllTipoOperacion', operacionService.getAllTipoOperacion);

// guardar nueva operacion
router.post('/save', operacionService.save);

module.exports = router;