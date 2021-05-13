//para validar la password encriptada
const bcryptjs = require('bcryptjs');

//importamos  express.js
const { response } = require ('express');

//importamos el helpper donde creamos el tokens
const { generarJWT } = require('../helpers/generar-jwt');

//importar mi modelo de usuario
const Usuario = require ('../models/user');

const login = async (req, res = response) => {


    //capturar el pass y el correo de la request
    const { correo, password} = req.body;

    try{
        // Verificar si el email existe

            // instanciamos nuestro modelo del usuario
            const usuario = await Usuario.findOne({correo});
            if( !usuario ){
                
                return res.status(400).json({
                    msg: 'El correo no a sido registrado'
                });
            }

        // Si el usuario esta activo
            if( !usuario.estado ){
                return res.status(400).json({
                    msg: 'Usuario: estado false'
                });
            }

        // Verificar la contrasena
            
            //me compara la contrasenia aunque esta este encriptadas
            const validPass = bcryptjs.compareSync( password, usuario.password);
            if( !validPass ){
                return res.status(400).json({
                    msg: 'Usuario: Password no es correcta'
                });
            }



        // Generar el JWT   -> npm i jsonwebtoken
            
            const token = await generarJWT( usuario.id );


        //solo se puede mandar un res
        res.json({
            usuario,
            token
        })

    }catch(error){
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }
}
module.exports = {
    login
}