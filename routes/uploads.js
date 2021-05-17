//destructurar un metodo de express
const { Router } = require('express');

//requerir el check para validar los campos "npm i express-validator"
const { check } = require('express-validator');

//importar el controlador
const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');

//importo el middleware que valida los campos
const { validarCampos, validarArchivo } = require('../middlewares');

//instanciar el metodo de express
const router = Router();


//subir archivo
router.post( '/',validarArchivo, cargarArchivo );

//subir o actualizar foto de usuarios o productos
router.put('/:coleccion/:id',[
        check('id','No es un id de Mongo valido').isMongoId(),
        check('coleccion').custom( c => coleccionesPermitidas( c , ['usuarios','productos'])),//validamos las colecciones que permitiremos, la "c" es la coleccion que nos mandan
        validarArchivo,
        validarCampos
],actualizarImagenCloudinary)
//],actualizarImagen); la de abajo solo si se sube a un hosting que permita cargar imagenes ya que heroku no lo permite

//cargar imagen 
router.get('/:coleccion/:id',[
        check('id','No es un id de Mongo valido').isMongoId(),
        check('coleccion').custom( c => coleccionesPermitidas( c , ['usuarios','productos'])),//validamos las colecciones que permitiremos, la "c" es la coleccion que nos mandan
        validarCampos,
], mostrarImagen)
//exportar 
module.exports = router;