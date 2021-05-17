//importar el path de node para trabajar con las rutas de las carpetas
const path = require( 'path' );

//npm para crear identificadores unicos
const { v4: uuidv4 } = require('uuid'); //npm i uuid

//si no mandamos la extencion, que verifique las que dejamos por defecto
const subirArchivo = ( files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'], carpeta = '') =>{

    //convertimos a promesa
    return new Promise( (resolve, reject)=> {

        //destructurar la req. para obtner el archivo  
    const { archivo } = files;

    // obtener la extencion del archivp
       const nombreCortado = archivo.name.split('.'); //el esplit crea un arreglo separadolos por .
       const extension = nombreCortado[ nombreCortado.length-1 ];
   
   // validar las extenciones validas
       if( !extensionesValidas.includes( extension )){
            return reject(`La extension ${ extension }, no es permitida. Permitidas: ${ extensionesValidas }`);

            //lo de abajo lo cambiamos por lo de arriba
        
                //    return res.status(400).json({
                //        msg: `La extencion ${ extension } no es permitida. Permitidas... ${ extensionesValidas}`
                //    });
       }
   
   
       //le agregamos un nombre temporal
       const nombreTemp = uuidv4() + '.'+ extension;
   
       //la ruta a donde se va a guardar el archivo
      const uploadPath = path.join( __dirname, '../uploads/',carpeta, nombreTemp ); //archivo.name  para obtneer el nombre del archivo
     
       archivo.mv(uploadPath, (err) => {
         if (err) {
             console.log(err)
                reject(err);
         }
     
         resolve( nombreTemp );
       });


    });



}

module.exports= {
    subirArchivo
}