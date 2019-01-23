import  mongoose from 'mongoose';

var Schema = mongoose.Schema;

var empresaSchema = new Schema({

    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    categorias: { type: Array, required: [false, 'Categoria'] },


});

var model_empresa = mongoose.model('Empresa', empresaSchema);

export const Empresa = model_empresa;