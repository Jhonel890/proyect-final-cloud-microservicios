const router = require('express').Router();

const InquietudControl = require('../app/controls/InquietudControl');

const inquietudControl = new InquietudControl();

router.get('/', (req, res) => inquietudControl.listar(req, res));
router.get('/:external', (req, res) => inquietudControl.obtener(req, res));
router.post('/', (req, res) => inquietudControl.guardar(req, res));
router.put('/:external', (req, res) => inquietudControl.modificar(req, res));
router.get('/persona/:external', (req, res) => inquietudControl.listarPorPersona(req, res));


module.exports = router;
