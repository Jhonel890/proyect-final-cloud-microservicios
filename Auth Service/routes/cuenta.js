const router = require('express').Router();

const CuentaControl = require('../app/controls/CuentaControl');

const cuentaControl = new CuentaControl();

router.get('/', cuentaControl.listar);
router.get('/:external', cuentaControl.obtener);
router.post('/auth', cuentaControl.inicio_sesion);


//metodoss y demas

module.exports = router;