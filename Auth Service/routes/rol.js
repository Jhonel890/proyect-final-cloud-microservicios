const router = require('express').Router();

const RolControl = require('../app/controls/RolControl');

const rolControl = new RolControl();

router.get('/', (req, res) => rolControl.listar(req, res));
router.post('/', (req, res) => rolControl.guardar(req, res));
router.get('/:external', (req, res) => rolControl.obtener(req, res));
router.put('/:external', (req, res) => rolControl.modificar(req, res));


//metodoss y demas

module.exports = router;