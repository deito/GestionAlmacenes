const router = require('express').Router();
const salidaService = require('../service/salidaService');

// guardar nueva Salida
router.post('/save', salidaService.save);

module.exports = router;