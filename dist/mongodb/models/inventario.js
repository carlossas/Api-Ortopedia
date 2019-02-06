"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
var Schema = mongoose_1.default.Schema;
var inventarioSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre del producto es necesario'] },
});
var model_inventario = mongoose_1.default.model('Inventario', inventarioSchema);
exports.Inventario = model_inventario;
