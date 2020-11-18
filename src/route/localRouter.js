const { Router } = require('express');
const router = new Router();

const localService = require('../service/localService');

// crear nuevo Local
router.post('/save', localService.save);

// actualizar
router.post('/updateById', localService.updateById);

// obtener todos los locales
router.get('/getAll', localService.getAll);

module.exports = router;