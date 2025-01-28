const router = require('express').Router();

const PersonaControl = require('../app/controls/PersonaControl');

const personaControl = new PersonaControl();

router.get('/', (req, res) => personaControl.listar(req, res));
router.get('/:external', (req, res) => personaControl.obtener(req, res));
router.post('/', (req, res) => personaControl.guardar(req, res));
router.put('/:external', (req, res) => personaControl.modificar(req, res));
router.get('/status/:external', (req, res) => personaControl.isPerfilCompleto(req, res));
router.post('/status/change/:external', (req, res) => personaControl.completarPerfil(req, res));
router.get('/misCoins/:external', (req, res) => personaControl.misCoins(req, res));
router.put('/modificarPerfiles/:external', (req, res) => personaControl.cambiarPerfiles(req, res));

module.exports = router;