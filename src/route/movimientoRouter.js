const router = require('express').Router();

const movimientoService = require('../service/movimientoService');

// contar filas con filtro
router.post('/countRowsByFilters', movimientoService.countRowsByFilters);

// buscar por filtros
router.post('/searchByFilters', movimientoService.searchByFilters);

// buscar detalles de movimiento
router.get('/getDetalleMovimientoById', movimientoService.getDetalleMovimientoById);

module.exports = router;