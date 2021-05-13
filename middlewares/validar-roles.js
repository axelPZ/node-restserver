const { response } = require('express');

//verificar si el role es administrador
const esAdminRole = ( req, res = response, next ) => {

    if( !req.usuario ){
        return res.status(500).json({
            msg: 'Se quier verificar el role sin valdar el token primero'
        });
    }

    // destructuramos el usuario que se a guardodo en la req al validar el jwt
    const { role, nombre} = req.usuario;

    if( role !== 'ADMIN_ROLE' ){
        return res.status(401).json({
            msg: `${ nombre }, usuario sin permisos, para ejecutuar esta tarea `
        });
    }
    
    next();
}

//verificar si el role es de dos tipos

const tieneRole = ( ...roles ) => {

    //retorno un funcion con los req y el res
    return (req, res = response, next ) => {

        if( !req.usuario ){
            return res.status(500).json({
                msg: 'Se quier verificar el role sin valdar el token primero'
            });
        }

        //validar si el role del usuario esta incluido en el role que emos descrito
        if(!roles.includes( req.usuario.role )){
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles ${ roles }`
            });
        }
        next();
    }

}

module.exports = {
    esAdminRole,
    tieneRole
}