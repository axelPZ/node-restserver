//importar mongoose 
const mongoose = require('mongoose');
const colors = require('colors');
//function de coneccion
const dbConnection = async() => {
    try{

        await mongoose.connect(process.env.MONGODB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: false,
            useFindAndModify: true
        });

        console.log(colors.blue('coneccion a la base de datos exitosa'));

    }catch(error){
        console.log(error);
        throw new Error(colors.red('Error a la hora de iniciar la base de datos...').process.env.MONGODB_CNN);
    }
}

module.exports = {
    dbConnection
}