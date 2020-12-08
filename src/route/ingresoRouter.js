const router = require('express').Router();

const ingresoService = require('../service/ingresoService');

// guardar nuevo ingreso
router.post('/nuevoIngreso', ingresoService.nuevoIngreso);

module.exports = router;