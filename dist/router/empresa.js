"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
//MODELO
const empresa_1 = require("../mongodb/models/empresa");
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
    //CREAMOS LA ENTIDAD EMPRESA CON LOS DATOS RECIBIDOS POR POST
    var nueva_empresa = new empresa_1.Empresa({
        nombre: body.nombre,
        categorias: body.categorias
    });
    empresa_1.Empresa.findOne({ nombre: body.nombre }, (err, datos) => {
        //SI SURGE UN ERROR EN LA BUSQUEDA
        if (err) {
            return res.status(200).json({
                error: true,
                mensaje: "Error al buscar usuario",
                errorType: err
            });
        }
        //VALIDAMOS SI EXISTE EL USUARIO
        if (datos) {
            return res.status(200).json({
                error: true,
                mensaje: "Este nombre de empresa ya existe en la base de datos."
            });
        }
        else {
            //SI NO ENCONTRAMOS NADA, GUARDAMOS LA EMPRESA EN LA BASE DE DATOS
            empresa_1.Empresa.create(nueva_empresa, (err, new_company) => {
                //SI SURGE UN ERROR EN LA BUSQUEDA
                if (err) {
                    return res.status(200).json({
                        error: true,
                        mensaje: "Error al buscar usuario",
                        errorType: err
                    });
                }
                else {
                    return res.status(200).json({
                        error: false,
                        mensaje: 'Empresa ingresada con exito.',
                        new_company: new_company
                    });
                }
            });
        }
    });
});
// ==========================================
// OBTENER EMPRESAS
// ==========================================
router.get('/obtener_empresas', (req, res) => {
    empresa_1.Empresa.find({}, (err, empresas) => {
        //SI SURGE UN ERROR EN LA BUSQUEDA
        if (err) {
            return res.status(200).json({
                error: true,
                mensaje: "Error al buscar empresas",
                errorType: err
            });
        }
        else {
            return res.status(200).json({
                error: false,
                empresas: empresas
            });
        }
    });
});
exports.route_empresa = router;
