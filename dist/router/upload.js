"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
//EXPRESS JS
const express_2 = __importDefault(require("express"));
//LIBRERIA DE EXPRESS PARA MANEJAR ARCHIVOS AL SERVIDOR
const express_fileupload_1 = __importDefault(require("express-fileupload"));
//FILE SYSTEM DE NODE
const fs_1 = __importDefault(require("fs"));
//MANEJADOR DE FORM-DATA
var multer = require('multer');
var upload = multer({
    dest: 'src/uploads/'
});
var app = express_2.default();
// Opciones por default del modulo fileupload
app.use(express_fileupload_1.default());
var router = express_1.Router();
router.post('/upload', upload.single('imagen'), (req, res) => {
    //RECIBIR DATOS POR POST(BODY) Y ASIGARLOS AL OBJETO PRODUCTO
    let producto = {
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        categoria: req.body.categoria,
        empresa: req.body.empresa
    };
    console.log(req.file);
    if (!req.file) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No hay archivos seleccionados'
        });
    }
    //OBTENER NOMBRE DEL ARCHIVO
    var archivo = req.file;
    //GENERA UN ARRAY POR CADA PUNTO DEL NOMBRE DEL ARCHIVO
    var nombreCortado = archivo.originalname.split('.');
    //TOMO EL ULTIMO PUNTO Y EXTRAIGO LA EXTENSION DEL ARCHIVO
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];
    //NOMBE DE ARCHIVO PERSONALIZADO
    var nombreArchivo = `${producto.nombre}-${producto.empresa}.${extensionArchivo}`;
    //MOVER EL ARCHIVO DE UN TEMPORAL A UN PATH DEL SERVIDOR
    var path = `src\\uploads\\${producto.empresa}\\${nombreArchivo}`;
    //SI NO EXISTE EL DIRECTORIO DE LA EMPRESA, LO CREAMOS
    if (!fs_1.default.existsSync(`src\\uploads\\${producto.empresa}`)) {
        fs_1.default.mkdirSync(`src\\uploads\\${producto.empresa}`);
    }
    fs_1.default.rename(archivo.path, path, (err) => {
        if (err)
            throw err;
        console.log('File Renamed!');
    });
    return res.status(500).json({
        ok: true,
        mensaje: 'correcto',
    });
});
exports.route_upload = router;
