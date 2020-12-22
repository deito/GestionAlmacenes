const router = require('express').Router();

const operacionService = require('../service/operacionService');

// obtener los Tipos de Operacion
router.get('/getAllTipoOperacion', operacionService.getAllTipoOperacion);

// guardar nueva operacion
router.post('/save', operacionService.save);

// contar filas con filtro
router.post('/countRowsByFilters', operacionService.countRowsByFilters);

module.exports = router;