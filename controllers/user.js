//destructurar un metodo de express
const { response } = require('express');

//requerir el paquete de encriptacion de la contasenia "npm i bcryptjs"
const bcryptjs = require('bcryptjs');

//exportar nuestro modelo
const Usuario = require('../models/user');




// GET
 const usuariosGet = async (req, res = response) => {

    //obtener los paramentros que vengan en el query(ruta)
    //const {q, nombre='no name', apikey} = req.query;

    //const usuarios = await Usuario.find(); //traer a todos los usuarios

    const { limite = 5, desde = 0} = req.query;

    const query = {
      estado: true
    }// este es el query para hacer las validaciones

    // NO SE RECOMIENDA USAR LOS "AWAIT" CUANDO HAY VARIAS PETICIONES A LA BASE DE DATOS, MEJOR SE USAN PROMESAS
        
        // const usuarios = await Usuario.find(query)
        //                 .skip(Number( desde ))//para crear la paginacion 
        //                 .limit(Number(limite)); //le ponemos un limite a los usuarios que queremos traer
                      
        // //saber cuantos registros tiene la base de datos
        // const total = await Usuario.countDocuments(query);



    // PETICIONES CON PROMESAS, MAS EFICIENTE

    // el await espera hasta que se ejecuten las promesas
    // const resp = await Promise.all([ //sin estructuracion de arreglos
    const [ total, usuarios ] = await Promise.all([//con estructuracion de arreglos
      Usuario.countDocuments(query),
      Usuario.find(query)
                .skip(Number( desde ))
                .limit(Number( limite ))
    ]);


    //cambiar el codigo de status HTTP 
        res.status(200).json({

          //resp // sin estructuracion de arreglos
            total, 
            usuarios
          
        });
  }

// POST
  const usuariosPost =  async(req, res = response) =>{

    // recir datos del front-end, pero antes especificar el tipo de dato en el server
    const { nombre, correo, password, role} = req.body;
 
     // instanciar nuestro modelo
     const usuario = new Usuario({nombre, correo, password, role});

    // encriptar la contrasenia
    const salt = bcryptjs.genSaltSync(10);//10 para que de 10 vueltas la encriptacion
    usuario.password = bcryptjs.hashSync( password, salt);

     // guardar en la base de datos
     await usuario.save();

     // respuesta
    res.status(200).json({
        usuario
    });
  }


// PUT
  const usuariosPut = async(req, res = response) =>{
    
    //recibir el id de la ruta
    const id = req.params.id;

    //quitamos los campos que no queremos actualizar
    const { _id, password, correo, google, ...restoInfo} = req.body;

    // todo validar contra base de datos
    if( password ){
      // encriptar la contrasenia
      const salt = bcryptjs.genSaltSync(10);//10 para que de 10 vueltas la encriptacion
      restoInfo.password = bcryptjs.hashSync( password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, restoInfo);

    res.status(200).json({

        msg: 'put API - controlador',
        usuario
    });
  }


// PATCH
  const usuariosPatch = (req, res = response) =>{
    //cambiar el codigo de status HTTP 
    res.status(202).json({

        msg: 'patch API - controlador'
    });
  }




// DELETE
  const usuariosDelete = async (req, res = response) =>{

    //obtengo el id de  la ruta    
    const { id } = req.params;


    // BORRAR EL USUARIO DEFINITIVAMENTE
        //const usuario = await Usuario.findByIdAndDelete( id );

    // SOLO CAMBIAR EL ESTADO DEL USUARIO
      const usuario = await Usuario.findByIdAndUpdate( id, {estado: false});

      //obtenfo el usuario autenticado que se a ingresado a la req con la verificacion del token
        //usuarioAutonticado = req.usuario;

    //cambiar el codigo de status HTTP 
    res.status(200).json({
        usuario,
        });
  }


  module.exports = {
      usuariosGet,
      usuariosPost,
      usuariosPut,
      usuariosPatch,
      usuariosDelete
  }