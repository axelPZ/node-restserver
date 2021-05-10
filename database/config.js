//importar mongoose 
const mongoose = require('mongoose');

require('dotenv').config();

//function de coneccion
const dbConnection = async() => {
    try{

        await mongoose.connect(process.env.MONGODB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: false,
            useFindAndModify: true
        });

        console.log('coneccion a la base de datos exitosa');

    }catch(error){
        console.log(error);
        throw new Error('Error a la hora de iniciar la base de datos...'.process.env.MONGODB_CNN);
    }
}

module.exports = {
    dbConnection
}