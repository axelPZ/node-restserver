const { Schema, model } = require('mongoose');

const CategoriaSchema = Schema({
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
    }
});

//seleccionar que campos si van a aparecer y cambiar de nombre
CategoriaSchema.methods.toJSON = function(){
    const { __v, _id,estado, ...categoria} = this.toObject();
    categoria.uid = _id;
    return categoria;
}


module.exports = model('Categoria', CategoriaSchema);