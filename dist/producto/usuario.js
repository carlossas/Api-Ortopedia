"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
// JSON WEB TOKEN
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//ENCRIPTADOR DE CONTRASEÑAS
const bcryptjs_1 = __importDefault(require("bcryptjs"));
//MODELO
const usuario_1 = require("../mongodb/models/usuario");
//CONEXION DE MONGODB
const mongodb_1 = __importDefault(require("../mongodb/mongodb"));
//MIDDLEWARE
const autenticacion_1 = __importDefault(require("../middlewares/autenticacion"));
//SEED
const config_1 = require("../config/config");
//USAR BODY PARSER EN ESTA RUTA
const server_1 = __importDefault(require("../server/server"));
const server = server_1.default.instance;
server.bodyParser();
mongodb_1.default.instance;
var router = express_1.Router();
// ==========================================
// Crear un nuevo usuario
// ==========================================
router.post('/registrar', autenticacion_1.default, (req, res) => {
    var body = req.body;
    //ASIGNA LOS DATOS DEL USUARIO QUE FUERON ENVIADOS A TRAVES DEL FORMULARIO POR MEDIO DE REQ.BODY
    var nuevo_Usuario = new usuario_1.Usuario({
        nombre: body.nombre,
        nombre_usuario: body.nombre_usuario,
        password: bcryptjs_1.default.hashSync(body.password, 10),
        role: body.role,
        empresa: body.empresa
    });
    //BUSCAMOS QUE ESTE USUARIO NO EXISTA EN LA BASE DE DATOS
    usuario_1.Usuario.findOne({ nombre_usuario: body.nombre_usuario }, (err, user) => {
        //SI SURGE UN ERROR EN LA BUSQUEDA
        if (err) {
            return res.status(200).json({
                error: true,
                mensaje: "Error al buscar usuario",
                errorType: err
            });
        }
        //VALIDAMOS SI EXISTE EL USUARIO
        if (user) {
            return res.status(200).json({
                error: true,
                mensaje: "Este nombre de usuario ya existe en la base de datos."
            });
        }
        else {
            //SI TODO SALE BIEN, CREAMOS EL USUARIO
            usuario_1.Usuario.create(nuevo_Usuario, (err, new_user) => {
                if (err) {
                    return res.status(200).json({
                        error: true,
                        mensaje: "Hubo un error al crear el usuario",
                        errorType: err
                    });
                }
                return res.status(200).json({
                    error: false,
                    usuario: new_user
                });
            });
        }
    });
});
// ==========================================
// INGRESAR
// ==========================================
router.post('/login', (req, res) => {
    var body = req.body;
    usuario_1.Usuario.findOne({ nombre_usuario: body.nombre_usuario }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                errors: err
            });
        }
        if (!bcryptjs_1.default.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                errors: err
            });
        }
        // Crear un token!!!
        usuarioDB.password = ':)';
        var token = jsonwebtoken_1.default.sign({ usuario: usuarioDB }, config_1.SEED, { expiresIn: 28800 }); // 8 horas
        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB._id
        });
    });
});
exports.route_usuario = router;
