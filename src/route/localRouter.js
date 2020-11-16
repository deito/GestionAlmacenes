const { Router } = require('express');
const router = new Router();

const localService = require('../service/localService');

// crear nuevo Local
router.post('/save', localService.save);

// actualizar
router.post('/updateById', localService.updateById);

module.exports = router;