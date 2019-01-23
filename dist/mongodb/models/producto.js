"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
var Schema = mongoose_1.default.Schema;
var productoSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    nombre_comercial: { type: String, required: [true, 'El nombre comercial es necesario'] },
    descripcion: { type: String, required: [true, 'La descripcion es necesaria'] },
    categoria: { type: String, required: [true, 'La categoria es necesaria'] },
    empresa: { type: String, required: [true, 'La empresa es necesaria'] },
    imagen: { type: String, required: [true, 'La imagen es necesaria'] },
    extension: { type: String, required: [true, 'La extension es necesaria'] }
});
var model_producto = mongoose_1.default.model('Producto', productoSchema);
exports.Producto = model_producto;
