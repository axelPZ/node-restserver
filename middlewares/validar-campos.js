
//requerir el validationResult para validar los campos del "npm i express-validator"
const { validationResult } = require('express-validator');


//function para validar los compas

const validarCampos = (req, res, next) => { //el next es propio de los middleware

    //validamos los campos que ya hemos creado los middleware check en las rutas
    const errors = validationResult(req);
    if(!errors.isEmpty()){
      
      // si no pasa la validacion retornara un 400
      return res.status(400).json(errors);
    }

    next();//significa que si pasan la validacion pase al siguiente midlleware si existiera
}


module.exports = {
    validarCampos
}