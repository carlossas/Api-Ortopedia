"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
var Schema = mongoose_1.default.Schema;
var empresaSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    categorias: { type: Array, required: [false, 'Categoria'] },
});
var model_empresa = mongoose_1.default.model('Empresa', empresaSchema);
exports.Empresa = model_empresa;
