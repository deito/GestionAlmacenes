const router = require('express').Router();

const movimientoService = require('../service/movimientoService');

// contar filas con filtro
router.post('/countRowsByFilters', movimientoService.countRowsByFilters);

// buscar por filtros
router.post('/searchByFilters', movimientoService.searchByFilters);

module.exports = router;