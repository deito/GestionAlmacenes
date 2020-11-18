const { Router } = require('express');
const router = new Router();

const rolService = require('../service/rolService');

// obtener todos los roles
router.get('/getAll', rolService.getAll);

module.exports = router;