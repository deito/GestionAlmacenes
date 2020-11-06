const { Router } = require('express');
const router = new Router();

const usuarioService = require('../service/usuarioService');

// crear nuevo = agregar nuevo = guardar
router.post('/save', usuarioService.save);

router.post('/login', usuarioService.login);

module.exports = router;