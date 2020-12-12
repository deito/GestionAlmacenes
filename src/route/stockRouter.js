const router = require('express').Router();

const stockService = require('../service/stockService');

// obtener todo el Stock
router.get('/getAll', stockService.getAll);

module.exports = router;