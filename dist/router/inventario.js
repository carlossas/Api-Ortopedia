"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
//CONEXION DE MONGODB
const mongodb_1 = __importDefault(require("../mongodb/mongodb"));
//USAR BODY PARSER EN ESTA RUTA
const server_1 = __importDefault(require("../server/server"));
const server = server_1.default.instance;
server.bodyParser();
//MIDDLEWARE
const autenticacion_1 = __importDefault(require("../middlewares/autenticacion"));
mongodb_1.default.instance;
var router = express_1.Router();
// ==========================================
// INGRESAR UNA NUEVA EMPRESA
// ==========================================
router.post('/nuevaempresa', autenticacion_1.default, (req, res) => {
    var body = req.body;
});
// ==========================================
// OBTENER EMPRESAS
// ==========================================
exports.route_inventario = router;
