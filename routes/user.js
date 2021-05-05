//destructurar un metodo de express
const { Router } = require('express');
const { usuariosGet, usuariosPost, usuariosPut, usuariosPatch, usuariosDelete } = require('../controllers/user');

//requerir el check para validar los campos "npm i express-validator"
const { check } = require('express-validator');

//requerir el helper para validar el role y el email
const { esRoleValido, emailExiste, existUserId } = require('../helpers/db-validators');

//importar el middleware que emos creado para validar los campos
const { validarCampos } = require('../middlewares/validar-campos');



const router = Router();



//llamar los metodos del controlador
router.get('/', usuariosGet);


//AGREGAR USUARIO
//le agregamos middlewares de validacion a la ruta
router.post('/',[
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),//con .not() negamos si esta vacio
        check('password','EL passwor tiene que tener minimo 6 caracters').isLength({min: 6}),
        check('correo','El correo no es valido').isEmail(),//validamos si el correo es valido, pero lo verificamos en el constructor
        check('correo').custom(emailExiste),//llamamos el helper paravalidar el email
        //check('role','El rol no es valido').isIn(['ADMIN_ROLE','USER_ROLE']),//le inidicamos las dos formas que queremos el role, pero en esta vez se ara con la base de datos
        
        // validar el role con validacion personalizada
        //check('role').custom((role) => esRoleValido(role)),//esto lo podemos simplificar ya que lo que recive el check es igual al argumento que se le mando al helper
        check('role').custom( esRoleValido ),

        validarCampos //el ultimo middleware que se llama es el que hemos creado
],usuariosPost);


//ACTUALIZAR USUARIO
// el id le decimos que el valor que mandemos en la ruta a guardarse en el id
router.put('/:id',[

        check('id','No es un ID valido').isMongoId(),//si el id es un id de mongo
        check('id').custom(existUserId),//validar si el id existe
        check('role').custom( esRoleValido ),
        validarCampos
], usuariosPut);

// ELIMINAR USUARIO
router.delete('/:id', [
        check('id','No es un ID valido').isMongoId(),//si el id es un id de mongo
        check('id').custom(existUserId),//validar si el id existe
        validarCampos
                ],usuariosDelete);

router.patch('/', usuariosPatch);

  
module.exports = router;