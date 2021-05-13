
//importamos el jwt que emos instalado
const { response } = require('express');
const jwt = require('jsonwebtoken');



const generarJWT = (uid ='' )=>{

    return new Promise(( resolve, reject) => {

        //el JSON con la info que queremos guardar en el TOKEN
        const payload = { uid };

        //generar el JWT
        jwt.sign( payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '4h' // cuanto queremos que dure el token

        },(err, token) =>{

            if( err ){
                console.log(err);
                reject( 'no se pudo generar el token' );
            }else{

                resolve( token );
            }
        });
    });
}


module.exports = {
    generarJWT
}