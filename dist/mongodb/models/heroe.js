"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var heroeSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    poder: { type: String, required: [true, 'El poder es necesario'] },
});
var Heroe = mongoose.model('Heroe', heroeSchema);
exports.default = Heroe;
