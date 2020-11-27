const router = require('express').Router();

const proveedorService = require('../service/proveedorService');

// obtener todos
router.get('/getAll', proveedorService.getAll);

// crear nuevo, guardar
router.post('/save', proveedorService.save);

module.exports = router;