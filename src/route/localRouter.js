const { Router } = require('express');
const router = new Router();

const localService = require('../service/localService');

// crear nuevo Local
router.post('/save', localService.save);

// actualizar
router.post('/updateById', localService.updateById);

// obtener todos los locales
router.get('/getAll', localService.getAll);

// obtener por id
router.get('/getById', localService.getById);

module.exports = router;