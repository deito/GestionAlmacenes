const router = require('express').Router();

const proveedorService = require('../service/proveedorService');

// obtener todos
router.get('/getAll', proveedorService.getAll);

module.exports = router;