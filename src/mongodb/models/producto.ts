import  mongoose from 'mongoose';

var Schema = mongoose.Schema;

var productoSchema = new Schema({

    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    nombre_comercial: { type: String, required: [true, 'El nombre comercial es necesario'] },
    descripcion: { type: String, required: [true, 'La descripcion es necesaria'] },
    categoria: { type: String, required: [true, 'La categoria es necesaria'] },
    empresa: { type: String, required: [true, 'La empresa es necesaria'] },
    sucursales: { type: Array, required: [false, 'Las sucursales son necesaria}s'] },
    imagen: { type: String, required: [true, 'La imagen es necesaria'] },
    extension: { type: String, required: [true, 'La extension es necesaria'] },




});

var model_producto = mongoose.model('Producto', productoSchema);

export const Producto = model_producto;