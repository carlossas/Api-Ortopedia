import  mongoose from 'mongoose';

var Schema = mongoose.Schema;

var inventarioSchema = new Schema({

    nombre: { type: String, required: [true, 'El nombre del producto es necesario'] },

});

var model_inventario = mongoose.model('Inventario', inventarioSchema);

export const Inventario = model_inventario;