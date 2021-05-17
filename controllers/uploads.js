// para trabajar con las rutas, NodeJs
const path = require('path');

// para trabajar con los file, NodeJs
const fs = require('fs');

// importar el npm que se utilizara para subir imagenes al servidor de claudin =  npm i cloudinary
var cloudinary = require('cloudinary').v2
    // autenticarse para claundin
        cloudinary.config( process.env.CLOUDINARY_URL);

const { response } = require('express');
//importamo el helper de subir archivo
const { subirArchivo } = require('../helpers');

const { Usuario, Producto } = require('../models');



const cargarArchivo = async (req, res = response ) => {

    try {
        // imagenes
        //const nombre = await subirArchivo(req.files);

        // pdf y txt
       // const nombre = await subirArchivo(req.files, ['pdf','txt']);

       //  si queremos los tipos de archivo por defecto pero queremos especificar la carpeta
            //const nombre = await subirArchivo(req.files, undefined, 'nombre-carpeta');


       // si querermo que guarde en una carpeta aparte manamos el tercer argumento a nuestro helper, si no existe la carpeta la creara
                const nombre = await subirArchivo(req.files, ['pdf','txt'], 'pdf\'s');


        res.status(200).json({
            msg:'archivo subido correctamente',
            nombre
        })     
    } catch (msg) {
        res.status(400).json({ msg });
    }
   
}
    // actualizar imagen
    const actualizarImagen = async(req, res =  response) =>
    {
        //extraigo los datos de la request
        const { id, coleccion } = req.params;

        let modelo;

        switch (coleccion) {
            case 'usuarios':

                modelo = await Usuario.findById(id);
                if( !modelo ){
                    return res.status(400).json({
                        msg: `No existe el usuario con el id ${ id }`
                    });
                }
                
                break;
            case 'productos':

                modelo = await Producto.findById(id);
                if( !modelo ){
                    return res.status(400).json({
                            msg: `No existe el producto con el id ${ id }`
                    });
                }
                    
                break;
        
            default:
                res.status(500).json({ msg: 'instruccion no programada aun'});
                break;
        }

        // Limpiar imagenes previas
        
        // verificamos si ya existe una imagen en la BD
        if( modelo.img ){

            // creamos el path donde se encuentra la imagen anteriror

            // __dirname = igual al baseUrl() de php, nos dirigimos a la carpeta "uploads" le decimos que coleccion, y luego el nombre de la imagen
            const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img);

            //verificamos si existe la imagen
            if( fs.existsSync( pathImagen ) ){

                //borramos la imagen
                fs.unlinkSync( pathImagen );
            }
        }

        //actualizar imagen
        const nombre = await subirArchivo(req.files, undefined, coleccion);
    
        // le agrego ala propiedad del modelo el nombre de la imagen
        modelo.img = nombre;

        //guardo o actualizo en la basse de datos la imagen
        modelo.save();

        res.status(200).json({ 
            msg: 'Imagen actualizada correctamente',
            modelo});
    }



    // mostrar la imagenn
    const mostrarImagen = async(req, res = response) => {

        const { id, coleccion } = req.params;

        let modelo;

        switch (coleccion) {
            case 'usuarios':

                modelo = await Usuario.findById(id);
                if( !modelo ){
                    return res.status(400).json({
                        msg: `No existe el usuario con el id ${ id }`
                    });
                }
                
                break;
            case 'productos':

                modelo = await Producto.findById(id);
                if( !modelo ){
                    return res.status(400).json({
                            msg: `No existe el producto con el id ${ id }`
                    });
                }
                    
                break;
        
            default:
                res.status(500).json({ msg: 'instruccion no programada aun'});
                break;
        }

        // Limpiar imagenes previas
        
        // verificamos si ya existe una imagen en la BD
        if( modelo.img ){

            // creamos el path donde se encuentra la imagen anteriror

            // __dirname = igual al baseUrl() de php, nos dirigimos a la carpeta "uploads" le decimos que coleccion, y luego el nombre de la imagen
            const pathImagen = path.join( __dirname, '../uploads', coleccion, modelo.img);

            //verificamos si existe la imagen
            if( fs.existsSync( pathImagen ) ){

                //cargar la imagen
                return res.sendFile( pathImagen );
               
            }
        }

        // __dirname = igual al baseUrl() de php, nos dirigimos a la carpeta "assets" le decimos que coleccion, y luego el nombre de la imagen

        const pathImagen = path.join( __dirname, '../assets', 'no-image.jpg');
        return res.sendFile( pathImagen );
}


// actualizar imagen utilizando Cloudinary
const actualizarImagenCloudinary = async(req, res =  response) =>
    {
        //extraigo los datos de la request
        const { id, coleccion } = req.params;

        let modelo;

        switch (coleccion) {
            case 'usuarios':

                modelo = await Usuario.findById(id);
                if( !modelo ){
                    return res.status(400).json({
                        msg: `No existe el usuario con el id ${ id }`
                    });
                }
                
                break;
            case 'productos':

                modelo = await Producto.findById(id);
                if( !modelo ){
                    return res.status(400).json({
                            msg: `No existe el producto con el id ${ id }`
                    });
                }
                    
                break;
        
            default:
                res.status(500).json({ msg: 'instruccion no programada aun'});
                break;
        }

        // Limpiar imagenes previas
        
        // verificamos si ya existe una imagen en la BD
        if( modelo.img ){


            //el id de la imagen biene al final del url, necesitamos sacarla y quitarle el .jpg
            //https://res.cloudinary.com/node-restserver/image/upload/v1621287658/ut1lozt5poubexyj6rq0.jpg

            // sacar la url de la imagen desde el modelo
                // creamos un array de la ruta separado por /
                const nombreArr = modelo.img.split('/');

                // obtenemos el ultimo elemento del arreglo
                const nombre = nombreArr[ nombreArr.length -1 ];

                // ya teniendo el ultimo elemento del arreglo tengo que quitarle la extensio
                // v1621287658/ut1lozt5poubexyj6rq0.jpg
                
                // obtengo el primer elemeto del arreglo que me crea split 
                const [ public_id ] = nombre.split('.');
                
                //ahora borrarmos la iimagen de cloudinary
                cloudinary.uploader.destroy( public_id );
        }

        //subir imagen a cloudinary
        const { tempFilePath } = req.files.archivo;

        //de la respuesta destructuro el "secure_url" que es donde se encuentra la imagen en cloudinary
        const { secure_url } = await cloudinary.uploader.upload( tempFilePath );

        // le agrego ala propiedad del modelo el nombre de la imagen
        modelo.img = secure_url;

        //guardo o actualizo en la basse de datos la imagen
         modelo.save();

        res.status(200).json({ 
            msg: 'Imagen actualizada correctamente',
            modelo
        });
    }




module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}