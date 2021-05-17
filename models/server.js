//instanciar express para el Rest Server
const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');
const colors = require('colors');
const fileUpload = require('express-fileupload'); //= npm i express-fileupload = https://www.npmjs.com/package/express-fileupload

class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {

            auth:       '/api/auth',
            categorias: '/api/categorias',            
            usuarios:   '/api/usuarios',
            productos:  '/api/productos',
            buscar:     '/api/buscar',
            uploads:    '/api/uploads'
        }
    
        // Conectar a base de datos
        this.connectionDB();

        // Middlewares
        this.middlewares();

        // Rutas de mi applicacion
        this.routes();
    }

    // coneccion a la base de datos
    async connectionDB(){
        await dbConnection();
    }
    
    //definir los middlewares
    middlewares(){
        //.use = senalar que es un middleware

        // CORS = sirve para indicar que rutas pueden tener acceso a nuestro rest server "npm i cors"
        this.app.use(cors());

        //Lectura y Parseo del body(recivir datos del front-end)
        this.app.use(express.json()); //para recivir un json

        //Directorio publico
        this.app.use( express.static('public'));

        //carga de archivos = npm i express-fileupload = https://www.npmjs.com/package/express-fileupload
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true  //extencion de express-fileupload para crear carpetas
        }));
    }

    //definir las rutas
    routes(){

        //neva path para el token y logeo de usuario
        this.app.use( this.paths.auth, require('../routes/auth'));
        //llamar una ruta de mis rutas de usuario
        this.app.use(this.paths.usuarios, require('../routes/user'));

        //llamar las rutas de  la categoria
        this.app.use(this.paths.categorias, require('../routes/categorias'));

        //llamar las rutas de productos
        this.app.use(this.paths.productos, require('../routes/productos'));

         //llamar las rutas de buscar
         this.app.use(this.paths.buscar, require('../routes/buscar'));

          //llamar las rutas de buscar
          this.app.use(this.paths.uploads, require('../routes/uploads'));
    }

    //definir el puerto de escucha
    listen(){
        
        //traer le puerto desde las variables de enotrno
        this.app.listen(this.port,()=> {
            console.log(colors.blue('Servidor corriendo en puerto... '),this.port );
        });
    }
}

module.exports = Server;