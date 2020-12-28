const router = require('express').Router();

const movimientoService = require('../service/movimientoService');

// contar filas con filtro
router.post('/countRowsByFilters', movimientoService.countRowsByFilters);

// buscar por filtros
router.post('/searchByFilters', movimientoService.searchByFilters);

// buscar detalles de Movimiento por id de Movimiento
router.get('/getDetalleMovimientoById', movimientoService.getDetalleMovimientoById);

// buscar detalles de movimiento por filtros
router.get('/getDetalleMovimientoByFilters', movimientoService.getDetalleMovimientoByFilters);

module.exports = router;