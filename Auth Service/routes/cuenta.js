const router = require('express').Router();

const CuentaControl = require('../app/controls/CuentaControl');

const cuentaControl = new CuentaControl();

router.get('/', (req, res) => cuentaControl.listar(req, res));
router.post('/auth', (req, res) => cuentaControl.autenticar(req, res));


//metodoss y demas

module.exports = router;