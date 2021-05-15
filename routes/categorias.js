//destructurar un metodo de express
const { Router } = require('express');

//requerir el check para validar los campos "npm i express-validator"
const { check } = require('express-validator');

//importamos nuestro controlador de categoria
const { crearCategoria, listarCategorias, getCategoria, editarCategoria, borrarCategoria } = require('../controllers/categorias');

//importar los helpers para aseguranos si existe la categoria
const { existeCategoria, existeCategoriaNombre } = require('../helpers/db-validators');

//validamos el JWT
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');


//instanciar el metodo de express
const router = Router();


/**
 * {{url}}/api/categorias
 */

//obtener todas las categorias - publico
router.get('/',
listarCategorias);

// obtener una categorias por id - publico
router.get('/:id',[
    check('id','No es un id valido').isMongoId(),
    check('id').custom( existeCategoria ),
    validarCampos
],getCategoria);

// crear categoria - privado - cualquier persona con un token valido
router.post('/',[
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('nombre').custom( existeCategoriaNombre ),
    validarCampos
],crearCategoria);

// actualizar -privado - cualquier con token valido
router.put('/:id',[
    validarJWT,
    esAdminRole,
    check('id','No es un id valido').isMongoId(),
    check('id').custom( existeCategoria ),
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('nombre').custom( existeCategoriaNombre ),
    validarCampos
], editarCategoria);

// borrar una categoria - admin
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    check('id','No es un id valido').isMongoId(),
    check('id').custom( existeCategoria ),
    validarCampos
],borrarCategoria);

module.exports = router;

