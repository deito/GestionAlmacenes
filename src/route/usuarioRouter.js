const { Router } = require('express');
const router = new Router();

const usuarioService = require('../service/usuarioService');

// crear nuevo = agregar nuevo = guardar
router.post('/save', usuarioService.save);

// Login
router.post('/login', usuarioService.login);

// obtener todos los usuarios
router.get('/getAll', usuarioService.getAll);

// actualizar usuario por id
router.post('/updateById', usuarioService.updateById);

// search by usuario and id_rol
router.post('/searchByUsuarioAndIdRol', usuarioService.searchByUsuarioAndIdRol);

// get by id
router.get('/getById', usuarioService.getById);

// actualizar estado por id
router.post('/updateEstadoById', usuarioService.updateEstadoById);

module.exports = router;