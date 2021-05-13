
//para unificar estas importacion de middleware vamos a crear constantes que contengan todo lo de los middleware


//importar el middleware que emos creado para validar los campos
const validaCampos  = require('../middlewares/validar-campos');

//middleware para valdiar el JWT
const validarJWT = require('../middlewares/validar-jwt');

//middleware que valida el role de los usuarios
const validaRoles = require('../middlewares/validar-roles');



//exportar los middleware

//con el expresOperation(...) exportamos todo lo que contengan los middlewares


module.exports = {
    ...validaCampos,
    ...validarJWT,
    ...validaRoles
}