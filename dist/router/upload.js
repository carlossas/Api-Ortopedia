"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
//MYSQL
const mysql_1 = __importDefault(require("../mysql/mysql"));
//EXPRESS JS
const express_2 = __importDefault(require("express"));
//LIBRERIA DE EXPRESS PARA MANEJAR ARCHIVOS AL SERVIDOR
const express_fileupload_1 = __importDefault(require("express-fileupload"));
//FILE SYSTEM DE NODE
const fs_1 = __importDefault(require("fs"));
//PATH
const path_1 = __importDefault(require("path"));
//OPTIMIZADOR DE IMAGENES
var Jimp = require('jimp');
//MANEJADOR DE FORM-DATA
var multer = require('multer');
//LOCALIZAR EL DIRECTORIO ACTUAL Y DESTINAR LA CARPETA DE IMAGENES A ESE PATH
var resolve = path_1.default.resolve(__dirname, '../public/uploads');
var upload = multer({
    dest: resolve
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
    if (!req.file) {
        return res.status(200).json({
            error: true,
            mensaje: 'No hay archivos seleccionados'
        });
    }
    //OBTENER NOMBRE DEL ARCHIVO
    var archivo = req.file;
    //VALIDAMOS QUE NO EXISTA UN PRODUCTO LLAMADO IGUAL
    let validarNombre = `
        SELECT * FROM productos WHERE nombre = '${producto.nombre}' && empresa = '${producto.empresa}'
    `;
    mysql_1.default.ejecutarConsulta(validarNombre, (err, datos) => {
        //SI EXISTE UN ERROR
        if (err) {
            return res.status(200).json({
                error: true,
                mensaje: err
            });
        }
        if (datos) {
            // ELIMINAMOS EL ARCHIVO GUARDADO TEMPORALMENTE
            fs_1.default.unlink(archivo.path, (error) => {
                if (error) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Ocurrio un error al borrar un archivo y el producto ya existe',
                        error: error
                    });
                }
                return res.json({
                    error: true,
                    mensaje: 'Ya existe un producto con este nombre'
                });
            });
        }
        else {
            //GENERA UN ARRAY POR CADA PUNTO DEL NOMBRE DEL ARCHIVO
            var nombreCortado = archivo.originalname.split('.');
            //TOMO EL ULTIMO PUNTO Y EXTRAIGO LA EXTENSION DEL ARCHIVO
            var extensionArchivo = nombreCortado[nombreCortado.length - 1];
            //NOMBE DE ARCHIVO PERSONALIZADO
            var nombreArchivo = `${producto.nombre}-${producto.empresa}.${extensionArchivo}`;
            //MOVER EL ARCHIVO DE UN TEMPORAL A UN PATH DEL SERVIDOR
            var dir = `${resolve}/${producto.empresa}/${nombreArchivo}`;
            //SI NO EXISTE EL DIRECTORIO DE LA EMPRESA, LO CREAMOS
            if (!fs_1.default.existsSync(`${resolve}/${producto.empresa}`)) {
                fs_1.default.mkdirSync(`${resolve}/${producto.empresa}`);
            }
            fs_1.default.rename(archivo.path, dir, (err) => {
                if (err) {
                    return res.status(200).json({
                        error: true,
                        mensaje: 'Ocurrio un error al renombrar el archivo.'
                    });
                }
            });
            // OPTIMIZAR LA IMAGEN
            Jimp.read(dir, (err, newImage) => {
                if (err) {
                    return res.status(200).json({
                        error: true,
                        mensaje: 'Ocurrio un error al optimizar la imagen seleccionada, intente de nuevo.'
                    });
                }
                newImage
                    .quality(70) // set quality
                    .resize(800, Jimp.AUTO)
                    .write(dir); // save
                //GUARDAMOS LA IMAGEN EN BASE DE DATOS
                let directorioImagen = `localhost:5000/uploads/${producto.empresa}/${nombreArchivo}`;
                //CONSULTA A MYSQL
                let consulta = `
                    INSERT INTO productos (nombre, descripcion, categoria, empresa, imagen) 
                    VALUES ('${producto.nombre}', '${producto.descripcion}', '${producto.categoria}', '${producto.empresa}', '${directorioImagen}')
                `;
                mysql_1.default.ejecutarConsulta(consulta, (err, datos) => {
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
                            mensaje: 'correcto'
                            // datos: datos
                        });
                    }
                });
            });
        }
    });
});
exports.route_upload = router;
