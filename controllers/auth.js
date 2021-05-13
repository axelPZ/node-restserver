//para validar la password encriptada
const bcryptjs = require('bcryptjs');

//importamos  express.js
const { response } = require ('express');

//importamos el helpper donde creamos el tokens
const { generarJWT } = require('../helpers/generar-jwt');

//importar mi modelo de usuario
const Usuario = require ('../models/user');

//helper de verificacion de token de google
const { googleVerify } = require('../helpers/google-verify');

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

//validar el token de google
const googleSignin = async(req, res = response) => {

    //recivo el toquen desde el fron-end
    const { id_token } = req.body;

    try {

        //verifico el token de Google y extraigo los datos del usuario
        const { correo, nombre, img } = await googleVerify( id_token );

        //verifico si existe el usuarip
        let usuario = await Usuario.findOne({ correo });

        if( !usuario ){

            //si no existe el usuario lo voy a crear
            const data = {
                nombre,
                correo,
                password: ':p',//la pass no es necesaria ya que el usuario fue creado con las credenciales de google
                img,
                google: true
            }

            //grabo el usuario en la BD
            usuario = new Usuario( data );
            await usuario.save();
        }

        // si el usuario no ha sido eliminado
        if( !usuario.estado ){
            return res.status(401).json({
                msg: 'Hable con el administraodr, usuario bloqueado'
            });
        }

         // Generar el JWT   -> npm i jsonwebtoken    
         const token = await generarJWT( usuario.id );


        res.json({
            usuario,
            token
        });
        
    } catch (error) {

        res.status(400).json({
            msg: 'Token de Google no es valido'
        })
        
    }
   
}
module.exports = {
    login,
    googleSignin
}