"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
// ==========================================
//  Verificar token
// ==========================================
var verificarToken = (req, res, next) => {
    var token = req.query.token;
    jsonwebtoken_1.default.verify(token, config_1.SEED, (err, decoded) => {
        if (err) {
            return res.status(200).json({
                error: true,
                mensaje: 'Token incorrecto',
                errors: err
            });
        }
        req.usuario = decoded.usuario;
        next();
    });
};
exports.default = verificarToken;
