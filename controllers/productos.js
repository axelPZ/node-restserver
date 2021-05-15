const { response } = require('express');
const {  Producto }= require('../models');


//Agregar los productos
const addProductos = async( req, res = response)=>{
    const { _id, estado,idCategoria, usuario, ...data} = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;
    data.categoria = idCategoria;

    const producto = await Producto( data );
    await producto.save();

    res.status(200).json({
        msg: 'producto a ingresar',
        producto
    })
}

//Listar los productos
const getProductos = async( req, res = response)=> {

    const { limite = 5, desde = 0} = req.query

    //query para obtener solo los productos vigentes
    const query = {
        estado: true
    }

    //populates para extraer le nombre de categoria y el usuario
    const populateUsuario = {
        path: 'usuario',
        select: 'nombre'
    }

    const populateCategoria = {
        path: 'categoria',
        select: 'nombre'
    }

    //promesas anidadas
    const [ total, productos ] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
                .populate(populateCategoria)
                .populate(populateUsuario)
                .skip( Number( desde ) )
                .limit( Number( limite ) )
    ])

    res.status(200).json({
        msg: 'Todos los productos',
        total,
        productos
    })
}

//listar producto por id
const getProductoId = async( req, res = response) => {

    const { id } = req.params;

       //populates para extraer le nombre de categoria y el usuario
       const populateUsuario = {
        path: 'usuario',
        select: 'nombre'
    }

    const populateCategoria = {
        path: 'categoria',
        select: 'nombre'
    }

    const producto = await Producto.findById( id )
                                   .populate( populateUsuario )
                                   .populate( populateCategoria )

    
    res.status(200).json({
        msg: ' Producto encontrado',
        producto
    })
}

//actualizar produto
const updateProducto = async( req, res = response ) => {

    const { id } = req.params;
    const { estado, usuario,idCategoria, ...data} = req.body;

    if( data.nombre ){
        data.nombre = data.nombre.toUpperCase();
    }

    data.usuario = req.usuario._id;
    data.categoria = idCategoria;

    const producto = await Producto.findByIdAndUpdate(id, data, {new: true });

    res.json({
        msg: 'producto actualizado exitosamente',
        producto
    })

}

//eliminar produto ( cambiar el estado a false )
const deleteProducto = async( req, res = response ) => {

    const { id } = req.params;

    const producto = await Producto.findByIdAndUpdate(id, { estado:false }, { new: true });

    res.status(200).json({
        msg: `Se elimino el producto ${ producto.nombre }`,
        producto
    })

}


module.exports = {
     addProductos,
     getProductos,
     getProductoId,
     updateProducto,
     deleteProducto
}