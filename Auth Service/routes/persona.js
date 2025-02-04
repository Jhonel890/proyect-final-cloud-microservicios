const router = require('express').Router();

const PersonaControl = require('../app/controls/PersonaControl');

const personaControl = new PersonaControl();

router.get('/', personaControl.listar);
router.get('/:external', personaControl.obtener);
router.post('/', personaControl.guardar);
router.put('/:external', personaControl.modificar);
router.get('/status/:external', personaControl.isPerfilCompleto);
router.post('/status/change/:external', personaControl.completarPerfil);
router.get('/misCoins/:external', personaControl.misCoins);
router.put('/modificarPerfiles/:external', personaControl.cambiarPerfiles);
router.get('/getbyID/:id', personaControl.obtenerPorID);
router.post('/addCoins/:external', personaControl.subir5Coins);
router.put('/subCoins/:external', personaControl.bajar5Coins);

module.exports = router;