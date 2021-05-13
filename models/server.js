//instanciar express para el Rest Server
const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');
const colors = require('colors');

class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';
        this.authPath = '/api/auth';
    
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
    }


    //definir las rutas
    routes(){

        //neva path para el token y logeo de usuario
        this.app.use( this.authPath, require('../routes/auth'));
        //llamar una ruta de mis rutas de usuario
        this.app.use(this.usuariosPath, require('../routes/user'));
        
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