//importar el paquete de express
const { response, request  } = require('express');

//exportar nuestro modelo
const Usuario = require('../models/user');

//importar el paquete de los jwt
const jwt = require('jsonwebtoken');

const validarJWT= async (req = request, res = response, next)=> {


    //header porque es el metodo como mandamos el token
        //x-token el nombre de la variable donde va nuestro token
        const token = req.header('x-token');

        //verificar si mandan el token
        if( !token ){
            return res.status(401).json({
                msg: 'No hay token en la peticion'
            });
        }

    // validar token
        try {



            //validar token y obtener su informacion
           const { uid } = jwt.verify( token, process.env.SECRETORPRIVATEKEY);

           //traer el usuario autenticado
           const usuario = await Usuario.findById( uid );

           // si el usuario no existiera
           if( !usuario ){
            return res.status(401).json({
                msg: 'El usuario no existe en la DB'
            });
           }
            
            // Verificar si el uid tiene estao true
            if( !usuario.estado ){

                return res.status(401).json({
                    msg: 'El usuario con estado false'
                });
            }
           //mandar el usuario autenticado por el req
           req.usuario = usuario;

           next();//el next es para que valla al siguinete middleware
        } catch (error) {
            console.log(error);
            res.status(401).json({
                msg: 'Token no valido'
            });
        }

       
}

module.exports = {
    validarJWT
}