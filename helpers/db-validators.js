//los helpers son validacione con la base de datos

//requerimos el modelo de nuestro role para hacer la validacoin
const Role = require('../models/role');

//exportar nuestro modelo para validar el email
const Usuario = require('../models/user');

//validar el role
const esRoleValido = async(role = '') =>  {
    const existeRol = await Role.findOne({ role }); //llamamos solo un elemento de la base de datos que coincida con el rol
    
    if(!existeRol){ //si no existe el rol entonces devolvemos un error
            throw new Error(`El rol ${role} no es valido. O, no a sido agregado.`);
    }
}

//validar si existe el email
const emailExiste = async( correo ='') =>{
    // verificar si el correo existe
    const existeEmail = await Usuario.findOne({correo: correo});// aqui busca solo un registro con ese correo
    if(existeEmail){
        throw new Error(`El correo: ${correo} ya existe. por favor ingrese otro`);
    }
}

//validar si el id existe
const existUserId = async ( id ) => {

    // Verificar si el correo existe
    const existeUsuario = await Usuario.findById(id);//funcion que me trae un usuario
    if(!existeUsuario){
        throw new Error(`El id ${id} no existe`);
    }
}


module.exports = {
    esRoleValido,
    emailExiste,
    existUserId
}