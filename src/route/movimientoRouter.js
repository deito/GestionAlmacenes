const router = require('express').Router();

const operacionService = require('../service/movimientoService');

// contar filas con filtro
router.post('/countRowsByFilters', operacionService.countRowsByFilters);

module.exports = router;