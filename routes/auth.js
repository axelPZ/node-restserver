//destructurar un metodo de express
const { Router } = require('express');

//requerir el check para validar los campos "npm i express-validator"
const { check } = require('express-validator');

//importar los metodos del contralador de auth
const { login, googleSignin } = require('../controllers/auth');

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


//hacer una ruta para la utenticacion de google
router.post('/google',[

    check('id_token', 'EL id_token es necesario').not().isEmpty(),
    validarCampos
],googleSignin);



//exportar 
module.exports = router;