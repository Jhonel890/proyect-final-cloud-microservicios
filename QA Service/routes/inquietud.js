const router = require('express').Router();

const InquietudControl = require('../app/controls/InquietudControl');

const inquietudControl = new InquietudControl();

router.get('/', inquietudControl.listar);
router.get('/respondidas', inquietudControl.listarRespondidas);
router.get('/:external', inquietudControl.obtener);
router.get('/desbloqueadas/:external_persona', inquietudControl.listarDesbloqueadas);
router.post('/', inquietudControl.guardar);
router.post('/desbloquear', inquietudControl.desbloquear);
router.put('/:external', inquietudControl.modificar);
router.get('/persona/:external', inquietudControl.inquietudesSegunPerfil);
router.get('/respondidaPersona/:external', inquietudControl.obtenerRespondidaPorPersona);


module.exports = router;