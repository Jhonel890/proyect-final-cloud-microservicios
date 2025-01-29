const router = require('express').Router();

const PerfilControl = require('../app/controls/PerfilControl');

const perfilControl = new PerfilControl();

router.get('/', perfilControl.listar);
router.get('/:external', perfilControl.obtener);
router.post('/', perfilControl.guardar);
router.put('/:external', perfilControl.modificar);
router.get('/misPerfiles/:external_id', perfilControl.obtenerPerfilesPorPersona);
router.post('/asignarPerfil', perfilControl.añadirPerfilesAPersona);


module.exports = router;