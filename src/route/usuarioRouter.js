const { Router } = require('express');
const router = new Router();

const usuarioService = require('../service/usuarioService');

// crear nuevo = agregar nuevo = guardar
router.post('/save', usuarioService.save);

// Login
router.post('/login', usuarioService.login);

// obtener todos los usuarios
router.get('/getAll', usuarioService.getAll);

module.exports = router;