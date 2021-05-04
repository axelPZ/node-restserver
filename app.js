//instanciar el dotenv para las variables de entorno
require('dotenv').config();

//importar nuestra clase de server
const Server = require('./models/server');


//instanciar nuestra clase de server
const server = new Server();


server.listen();
