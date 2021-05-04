//destructurar un metodo de express
const { response } = require('express');


// GET
 const usuariosGet = (req, res = response) => {

    //obtener los paramentros que vengan en el query(ruta)
    const {q, nombre='no name', apikey} = req.query;

    //cambiar el codigo de status HTTP 
        res.status(200).json({

            msg: 'get API - controlador',
            q,
            nombre,
            apikey
        });
  }

// POST
  const usuariosPost = (req, res = response) =>{
    
    //recir datos del front-end, pero antes especificar el tipo de dato en el server
    const {nombre, edad} = req.body;
     
    res.status(200).json({

        msg: 'post API - controlador',
        nombre,
        edad
    });
  }

// PUT
  const usuariosPut = (req, res = response) =>{
    
    //recibir el id de la ruta
    const id = req.params.id;


    res.status(200).json({

        msg: 'put API - controlador',
        id
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
  const usuariosDelete = (req, res = response) =>{
    //cambiar el codigo de status HTTP 
    res.status(200).json({

        msg: 'delete API - controlador'
    });
  }


  module.exports = {
      usuariosGet,
      usuariosPost,
      usuariosPut,
      usuariosPatch,
      usuariosDelete
  }