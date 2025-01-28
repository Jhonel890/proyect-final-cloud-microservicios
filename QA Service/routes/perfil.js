const router = require('express').Router();

const PerfilControl = require('../app/controls/PerfilControl');

const perfilControl = new PerfilControl();

router.get('/', (req, res) => perfilControl.listar(req, res));
router.get('/:external', (req, res) => perfilControl.obtener(req, res));
router.post('/', (req, res) => perfilControl.guardar(req, res));
router.put('/:external', (req, res) => perfilControl.modificar(req, res));


module.exports = router;
