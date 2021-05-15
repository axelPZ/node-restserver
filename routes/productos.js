//destructurar un metodo de express
const { Router } = require('express');

//requerir el check para validar los campos "npm i express-validator"
const { check } = require('express-validator');

//importar los helpers para aseguranos si existe la categoria
const { existeCategoria, categoriaBigente, existeProductoNombre, existeProductoId } = require('../helpers/db-validators');

//validamos el JWT
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

//importar el controlador
const { addProductos, getProductos, getProductoId, updateProducto, deleteProducto } = require('../controllers/productos');
//instanciar el metodo de express
const router = Router();



//RUTAS

//agregar producto
router.post('/',[
    validarJWT,
    check('nombre','El nombre es requerido').not().isEmpty(),
    check('nombre').custom( existeProductoNombre ),
    check('idCategoria','No es un id valido Categoria').isMongoId(),
    check('idCategoria').custom( existeCategoria ),
    check('idCategoria').custom( categoriaBigente ),
    validarCampos
], addProductos);

//listar productos
router.get('/', getProductos);

//listar producto por id
router.get('/:id',[
    check('id','No es un id valido').isMongoId(),
    check('id').custom( existeProductoId ),
    validarCampos
], getProductoId);

// editar producto
router.put('/:id',[
    validarJWT,
    check('id','No es un id valido').isMongoId(),
    check('id').custom( existeProductoId ),
    check('idCategoria','No es un id valido Categoria').isMongoId(),
    check('idCategoria').custom( existeCategoria ),
    check('idCategoria').custom( categoriaBigente ),
    validarCampos
], updateProducto);

//eliminar el produto
router.delete('/:id', [
    validarJWT,
    esAdminRole,
    check('id','No es un id valido').isMongoId(),
    check('id').custom( existeProductoId ),
    validarCampos
],deleteProducto);

//para verificar si estan bien las rutas
// router.post('/:id', (req, res) =>
// {
//     res.json({
//         msg: ' get post'
//     })
// });

module.exports = router;