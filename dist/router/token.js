"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
//MODELO
//USAR BODY PARSER EN ESTA RUTA
const server_1 = __importDefault(require("../server/server"));
const server = server_1.default.instance;
server.bodyParser();
//COMPROBAR TOKEN
const autenticacion_1 = __importDefault(require("../middlewares/autenticacion"));
var router = express_1.Router();
router.get('/verificarToken', autenticacion_1.default, (req, res) => {
    return res.status(200).json({
        error: false,
        mensaje: 'Token valido'
    });
});
exports.route_token = router;
