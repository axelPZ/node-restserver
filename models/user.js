const { Schema, model } = require('mongoose');

//crear los campos de usuario y sus validaciones con su esquema
const UsuarioSchema  = Schema({

    nombre:{
        type: String,//el tipo del campo
        required: [true, 'El nombre es obligatorio'] // le indicamos que si es requerido, y el mensaje por si no lo mandan
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true //le decimos que el correo va hacer unico
    },
    password: {
        type: String,
        required: [true, 'La contrasenia es obligatoria']

    },
    img: {
        type: String
    },
    role: {
        type: String,
        required: true,
        emun: ['ADMIN_ROLE', 'USER_ROLE']//le damos solo los dos tipos que sera el campo
    },
    estado:{
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
    
});

//funcion para que no aparescan campos al llamar a un usuario
UsuarioSchema.methods.toJSON = function(){
    const { __v, password, ...usuario} = this.toObject();//sacamos __v y el password, del  objeto
    return usuario;
}

//lo exportamos con el esquema y el nombre que le colocara mongoose
module.exports = model('Usuario', UsuarioSchema);