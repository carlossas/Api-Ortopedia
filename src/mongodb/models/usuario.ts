import  mongoose from 'mongoose';

var Schema = mongoose.Schema;

var usuarioSchema = new Schema({

    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    nombre_usuario: { type: String,  required: [true, 'El nombre de usuario es necesario'] },
    password: { type: String,  required: [true, 'El password es necesario'] },
    role: { type: String,  required: [true, 'El role es necesario'] },
    empresa: { type: String,  required: [true, 'La empresa es necesaria'] },

});

var model_usuario = mongoose.model('Usuario', usuarioSchema);

export const Usuario = model_usuario;