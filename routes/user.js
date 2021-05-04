//destructurar un metodo de express
const { Router } = require('express');
const { usuariosGet, usuariosPost, usuariosPut, usuariosPatch, usuariosDelete } = require('../controllers/user');

const router = Router();

//llamar los metodos del controlador
router.get('/', usuariosGet);
router.post('/', usuariosPost);

// el id le decimos que el valor que mandemos en la ruta a guardarse en el id
router.put('/:id', usuariosPut);
router.patch('/', usuariosPatch);
router.delete('/', usuariosDelete);

  
module.exports = router;