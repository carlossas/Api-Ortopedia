"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// MYSQL
const mysql_1 = __importDefault(require("../mysql/mysql"));
//ENCRIPTADOR DE CONTRASEÑAS
const bcryptjs_1 = __importDefault(require("bcryptjs"));
//USAR BODY PARSER
const server_1 = __importDefault(require("../server/server"));
const server = server_1.default.instance;
server.bodyParser();
var router = express_1.Router();
// ==========================================
// Crear un nuevo usuario
// ==========================================
router.post('/registrar', (req, res) => {
    var body = req.body;
    //ASIGNA LOS DATOS DEL USUARIO QUE FUERON ENVIADOS A TRAVES DEL FORMULARIO POR MEDIO DE REQ.BODY
    var usuario = {
        nombre: body.nombre,
        nombre_usuario: body.nombre_usuario,
        password: bcryptjs_1.default.hashSync(body.password, 10),
        role: body.role,
        empresa: body.empresa
    };
    //VALIDAMOS QUE NO EXISTA UN PRODUCTO LLAMADO IGUAL
    let insertarUsuario = `
    INSERT INTO usuarios (nombre, nombre_usuario, password, role, empresa) 
    VALUES ('${usuario.nombre}', '${usuario.nombre_usuario}', '${usuario.password}', '${usuario.role}', '${usuario.empresa}')
    `;
    mysql_1.default.ejecutarConsulta(insertarUsuario, (err, datos) => {
        //SI EXISTE UN ERROR
        if (err) {
            return res.status(200).json({
                error: true,
                mensaje: err
            });
        }
        else {
            return res.status(200).json({
                error: false,
                mensaje: 'usuario registrado',
                usuario: usuario
            });
        }
    });
});
// ==========================================
// INGRESAR
// ==========================================
router.post('/login', (req, res) => {
    res.json({
        ok: true,
        mensaje: "Todo esta bien"
    });
});
exports.route_usuario = router;
