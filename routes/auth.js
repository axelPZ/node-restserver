//destructurar un metodo de express
const { Router } = require('express');

//requerir el check para validar los campos "npm i express-validator"
const { check } = require('express-validator');

//importar los metodos del contralador de auth
const { login } = require('../controllers/auth');

//importo el middleware que valida los campos
const { validarCampos } = require('../middlewares/validar-campos');

//instanciar el metodo de express
const router = Router();

//llamar los metodos del controlador
router.post('/login',[
    check('correo', 'El correo es obligatorio').isEmail(),
    check('password', 'La contrasenia es obligatoria').not().isEmpty(),
    validarCampos
], login);




//exportar 
module.exports = router;