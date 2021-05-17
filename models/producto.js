const { Schema, model } = require('mongoose');

const ProductoSchema = Schema({
    nombre:{
        type: String,
        required: [true, 'El nombre es requerido'],
        unique: true
    },
    estado: {
        type: Boolean,
        default: true,
        require: true
    },
    usuario:{
        type: Schema.Types.ObjectId,    ///para hacer la relacion con usuarios
        ref: 'Usuario',                 ///le digo commo se llamar la "tabla" que va hacer la relacio
        required: true
    },
    precio: {
     type: Number,
     default: 0.00
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    descripcion: {
        type: String
    },
    disponible: {
        type: Boolean,
        default: true
    },
    img: { type: String },

});

//seleccionar que campos si van a aparecer y cambiar de nombre
ProductoSchema.methods.toJSON = function(){
    const { __v, _id,estado, ...producto} = this.toObject();
    producto.uid = _id;
    return producto;
}


module.exports = model('Producto', ProductoSchema);