const { response  } = require('express');

//importar los tipos de mongoose
const { ObjectId } = require('mongoose').Types;

//importar mis modelos
const{ Usuario, Producto, Categoria } = require('../models');

//agregar colecciones permitidas para la busqueda
const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
];

//funcion para buscarUsuarios
const buscarUsuarios = async( termino = '', res = response ) => {

    const esMongoID = ObjectId.isValid( termino );//verificar si el id es u id valido de mongo

    //si lo que nos mandan es un id
    if( esMongoID ) {

        const usuario = await Usuario.findById( termino );

        //trabajaremos con un ternario para verificar si hay resultados
       return res.json( {
            results: ( usuario ) ? [ usuario ] : []
            });
    }

    //si lo queremos buscar por nombre

        // usaremos una expresion para traer todas las coencidencias
        const regex = new RegExp( termino, 'i' ); //con la i le quitamos la sensivilidad a las mayusculas

        //utilizamos el "$or" que significa o... busamos por el nombre o por el correo
        const usuarios = await Usuario.find({ 
            $or: [{ nombre: regex }, { correo: regex }], //$and  = y, $where
            $and: [{ estado: true }]
         });

       //cuantos resultados encuentra
       const cantidad = await Usuario.countDocuments({ $and: [ { nombre:regex },{ estado: true } ] })
                    
       res.json({
           cantidad,
           results: usuarios
       })
}

//funcion para buscar producto
const buscarProductos = async( termino = '', res = response) =>{
    const esMongoID = ObjectId.isValid( termino );//verificar si el id es u id valido de mongo

    //si lo que nos mandan es un id
    if( esMongoID ) {

        const producto = await Producto.findById( termino );

        //trabajaremos con un ternario para verificar si hay resultados
       return res.json( {
            results: ( producto ) ? [ producto ] : []
            });
    }

    //si lo queremos buscar por nombre

        // usaremos una expresion para traer todas las coencidencias
        const regex = new RegExp( termino, 'i' ); //con la i le quitamos la sensivilidad a las mayusculas

        //utilizamos el "$or" que significa o... busamos por el nombre o por el correo
        const productos = await Producto.find({ 
                $and: [ { nombre:regex },{ estado: true }]})
                        .populate('usuario','nombre')
                        .populate('categoria','nombre')

        //cuantos resultados encuentra
        const cantidad = await Producto.countDocuments({ $and: [ { nombre:regex },{ estado: true } ] })
                    
        res.json({
            cantidad,
            results: productos
        })

}

//funcion para buscar la categoria
const buscarCategorias = async( termino = '', res = response) =>{
    const esMongoID = ObjectId.isValid( termino );//verificar si el id es u id valido de mongo

    //si lo que nos mandan es un id
    if( esMongoID ) {

        const categoria = await Categoria.findById( termino );

        //trabajaremos con un ternario para verificar si hay resultados
       return res.json( {
            results: ( categoria ) ? [ categoria ] : []
            });
    }

    //si lo queremos buscar por nombre

        // usaremos una expresion para traer todas las coencidencias
        const regex = new RegExp( termino, 'i' ); //con la i le quitamos la sensivilidad a las mayusculas


        //utilizamos el "$or" que significa o... busamos por el nombre o por el correo
        const categorias = await Categoria.find({ 
            $and: [ { nombre:regex },{ estado: true }]})
                    .populate('usuario','nombre')

        //cuantos resultados encuentra
        const cantidad = await Categoria.countDocuments({ $and: [ { nombre:regex },{ estado: true } ] })
                    
        res.json({
            cantidad,
            results: categorias
        })

}


const buscar = ( req, res = response ) => {

    //obtengo los terminos de busqueda de la url
    const { coleccion, termino } = req.params;

    //verificar si las coleccion que mandan esta en las permitidas

    if( !coleccionesPermitidas.includes( coleccion )){
        return res.status(400).json({
            msg: `Las coleciones permitidas son: ${ coleccionesPermitidas }`
        })
    }

   switch( coleccion ){
    case 'usuarios':
        buscarUsuarios(termino, res);

    break;
    case 'categorias':
        buscarCategorias(termino, res);
    break;
    case 'productos':
        buscarProductos(termino, res);

    break;
    default:
        res.status(500).json({
            msg: 'Busqueda aun no programada'
        });
    break;
   }
}


module.exports = {
    buscar
}