const router = require('express').Router();

const RespuestaControl = require('../app/controls/RespuestaControl');

const respuestaControl = new RespuestaControl();

router.get('/', (req, res) => respuestaControl.listar(req, res));
router.get('/:external', (req, res) => respuestaControl.obtener(req, res));
router.post('/', (req, res) => respuestaControl.guardar(req, res));
router.put('/:external', (req, res) => respuestaControl.modificar(req, res));
router.get('/misRespuestas/:persona', (req, res) => respuestaControl.listarPorPersona(req, res));


module.exports = router;
