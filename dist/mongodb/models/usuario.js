"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
var Schema = mongoose_1.default.Schema;
var usuarioSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    nombre_usuario: { type: String, required: [true, 'El nombre de usuario es necesario'] },
    password: { type: String, required: [true, 'El password es necesario'] },
    role: { type: String, required: [true, 'El role es necesario'] },
    empresa: { type: String, required: [true, 'La empresa es necesaria'] },
});
var model_usuario = mongoose_1.default.model('Usuario', usuarioSchema);
exports.Usuario = model_usuario;
