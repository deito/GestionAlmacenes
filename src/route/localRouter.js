const { Router } = require('express');
const router = new Router();

const localService = require('../service/localService');

// crear nuevo Local
router.post('/save', localService.save);

module.exports = router;