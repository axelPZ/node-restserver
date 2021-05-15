const { response } = require('express');

// importo mi modelo de categoria desde el index que tengo en los models
const { Categoria } = require('../models');

// obtner las categorias - paginado -total - populate->investigar de Mongoose
const listarCategorias = async (req, res = response) => {

    //obtengo los limites
    const { limite = 5, desde = 0 }= req.query;
  
    ///le agregamos un JS para decirle que solo me traiga las que tienen estado true
    const query = {
        estado: true
    }

    //para hacer la referencia del usuario que creo la categoria
    const populate = {
        path: 'usuario',
        select: 'nombre'
    }

    //con promesas puede hacer varios llamados a la BD mas rapidos
    const [ total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
        .populate(populate)
        .skip(Number( desde ))
        .limit(Number( limite ))

    ]);

    //  NO PUDE HACER EL POPULATE


    //const populate = {path: 'ADDED_BY', select: 'PERSONAL_DATA.NAME PERSONAL_DATA.LASTNAME'

    res.status(200).json({
        msg: 'todas las categorias',
        total,
        categorias
    });
}


// obtener categoria - populate {}
const getCategoria = async(req, res = response) => {

    //obtener el id
    const id = req.params.id; //paramas porque viene el id en la ruta

       //para hacer la referencia del usuario que creo la categoria
       const populate = {
        path: 'usuario',
        select: 'nombre'
    }

        //  NO PUDE HACER EL POPULATE


    const categoria =  await Categoria.findById( id ).populate(populate);

    //validar si aun esta activa la categoria
    if( !categoria.estado ){
        return res.status(400).json({
            msg: 'la categoria esta inactiva'
        });
    }

    res.status(200).json({
        msg: 'Categoria',
        categoria
    });
}

const crearCategoria = async(req, res =  response) => {

    // atrapar el nombre que nos mandan desde la request y lo combierto a mayuscula
    const nombre = req.body.nombre.toUpperCase();

    // Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id //al momento de validar el JWT guardamos en la req al usuario
    }

    // guardar en db
    const categoria = new Categoria( data );
    await categoria.save();

    //mandar la respuesta
    res.status(201).json(categoria);


}

// actualizar la categoria

const editarCategoria = async( req, res = response) =>{

     //obtener el id
     const { id } = req.params;

    //sacar los datos que no necesitamos por si los mandan
    const { estado, usuario, ...data} = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id; //el id del usuario que esta haciendo la actualizacion

    //editar la categoria
    const categoria = await Categoria.findByIdAndUpdate(id, data, {new: true}); //manda el archivo actualizado

    res.status(200).json({

        msg: `Se a editaco la categorias correctamente`,
        categoria
    })

}


// borrar categoria - estado: falsse

const borrarCategoria = async(req, res = response) => {

    const { id } = req.params;
    
    //eliminar categoria( poner el estado a false )
    const categoria = await Categoria.findByIdAndUpdate(id, { estado: false }, {new: true});

    res.status(200).json({
        msg: `Se a eliminado ${categoria.nombre}`,
        categoria
    });
}

module.exports = {
    crearCategoria,
    listarCategorias,
    getCategoria,
    editarCategoria,
    borrarCategoria
}