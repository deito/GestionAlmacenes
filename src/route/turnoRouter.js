const router = require('express').Router();

const turnoService = require('../service/turnoService');

// buscar el último turno de un Usuario por id_usuario e id_local
router.post('/searchLastTurnoByIdUsuarioAndIdLocal', turnoService.searchLastTurnoByIdUsuarioAndIdLocal);

module.exports = router;