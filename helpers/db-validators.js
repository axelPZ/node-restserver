//los helpers son validacione con la base de datos

//importo desde el index de los modelos, para hacer las validaciones
const { Categoria, Usuario, Role, Producto } = require('../models');

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


//HELPERS DE LA CATEGORIA

//validar si existe la categoria
const existeCategoria =  async( id )=>
{
    // Verificar si el correo existe
    const existeCategoria = await Categoria.findById(id);//funcion que me trae un usuario
    if(!existeCategoria){
        throw new Error(`la categoria con el id ${id} no existe`);
    }
}

//validar si existe la categoria por nombre
const existeCategoriaNombre = async( nombre )=>{

    nombre = nombre.toUpperCase();

    const data = {
        nombre
    }

    const existeCategoria = await Categoria.findOne( data );
    if(existeCategoria){
        throw new Error( `la categoria con el nombre ${ nombre } ya existe`);
    }
}

//si la categoria esta vigente
const categoriaBigente = async( id )=>{

    const categoria = await Categoria.findById( id );

    if( !categoria.estado ){
        throw new Error( `la categoria, ${ nombre } no esta vigente`);
    }
}


//HELPERS DE PRODUCTO

const existeProductoNombre= async( nombre )=>{
    nombre = nombre.toUpperCase();

    const data = {
        nombre
    }

    const existeProducto = await Producto.findOne( data );
    if(existeProducto){
        throw new Error( `El producto ${ nombre } ya existe`);
    }

}

const existeProductoId = async ( id ) => {
    // Verificar si el correo existe
    const existeProducto = await Producto.findById( id );//funcion que me trae un usuario
    if(!existeProducto){
        throw new Error(`el producto con el id ${id} no existe`);
    }
}


//validar las colecciones permitidas al actualizar image
const coleccionesPermitidas = ( coleccion = '', colecciones = []) => {

    const incluida = colecciones.includes( coleccion );
    if( !incluida ){
        throw new Error(`La coleccion ${ coleccion }, no es permitida. Permitidas: ${ colecciones }`);
    }

    return true;
}

module.exports = {
    esRoleValido,
    emailExiste,
    existUserId,
    existeCategoria,
    existeCategoriaNombre,
    categoriaBigente,
    existeProductoNombre,
    existeProductoId,
    coleccionesPermitidas
}