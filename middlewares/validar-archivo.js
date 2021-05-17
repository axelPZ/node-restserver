//importar el paquete de express
const { response, request  } = require('express');

//function para validar los compas

const validarArchivo = (req = request, res = response, next) => { //el next es propio de los middleware

     //verificar si nos estan mandando un archivo, y en el ultimo si viene el nombre
     if ( !req.files || Object.keys(req.files).length === 0 || !req.files.archivo ) 
     {
       return res.status(400).json({
           msg: 'no hay archivos para subir'
       });
     }
 
    next();//significa que si pasan la validacion pase al siguiente midlleware si existiera
}


module.exports = {
    validarArchivo
}