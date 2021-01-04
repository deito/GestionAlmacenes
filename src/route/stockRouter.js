const router = require('express').Router();

const stockService = require('../service/stockService');

// obtener todo el Stock
router.get('/getAll', stockService.getAll);

// contar filas con filtros
router.post('/countRowsByFilters', stockService.countRowsByFilters);

// buscar por filtros
router.post('/searchByFilters', stockService.searchByFilters);

module.exports = router;