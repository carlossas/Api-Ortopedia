"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
//CONEXION DE MONGODB
const mongodb_1 = __importDefault(require("../mongodb/mongodb"));
//MODELO/SCHEMA DEL PRODUCTO
const producto_1 = require("../mongodb/models/producto");
//MIDDLEWARE
const autenticacion_1 = __importDefault(require("../middlewares/autenticacion"));
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
//NUEVA INSTANCIA DE MONGO
mongodb_1.default.instance;
var router = express_1.Router();
// ==========================================
// Editar imagen de un producto
// ==========================================
router.post('/editarImagenProducto', autenticacion_1.default, upload.single('imagen'), (req, res) => {
    var body = req.body;
    //OBTENER NOMBRE DEL ARCHIVO
    var archivo = req.file;
    if (!req.file) {
        return res.status(200).json({
            error: true,
            mensaje: 'No hay archivos seleccionados'
        });
    }
    //NOMBE DE ARCHIVO PERSONALIZADO
    var nombreArchivo = `${body.nombre}.${body.extension}`;
    //MOVER EL ARCHIVO DE UN TEMPORAL A UN PATH DEL SERVIDOR
    var dir = `${resolve}/${body.empresa}/${nombreArchivo}`;
    //SI NO EXISTE EL DIRECTORIO DE LA EMPRESA, LO CREAMOS
    if (!fs_1.default.existsSync(`${resolve}/${body.empresa}`)) {
        return res.status(200).json({
            error: true,
            mensaje: 'El path no existe',
        });
    }
    fs_1.default.rename(archivo.path, dir, (err) => {
        if (err) {
            return res.status(200).json({
                error: true,
                mensaje: 'Ocurrio un error al renombrar el archivo.',
                err: err
            });
        }
        else {
            // OPTIMIZAR LA IMAGEN
            Jimp.read(dir, (err, newImage) => {
                newImage
                    .quality(70) // set quality
                    .resize(800, Jimp.AUTO)
                    .write(dir); // save
                if (err) {
                    return res.status(200).json({
                        error: true,
                        mensaje: 'Ocurrio un error al optimizar la imagen'
                    });
                }
                return res.status(200).json({
                    error: false,
                    mensaje: 'Imagen remplazada'
                });
            });
        }
    });
});
// ==========================================
// Subir un nuevo producto
// ==========================================
router.post('/nuevoproducto', autenticacion_1.default, upload.single('imagen'), (req, res) => {
    var body = req.body;
    if (!req.file) {
        return res.status(200).json({
            error: true,
            mensaje: 'No hay archivos seleccionados'
        });
    }
    //OBTENER NOMBRE DEL ARCHIVO
    var archivo = req.file;
    //VALIDAMOS QUE NO EXISTA UN PRODUCTO LLAMADO IGUAL
    producto_1.Producto.findOne({ nombre: body.nombre + '-' + body.empresa }, (err, prod) => {
        //SI SURGE UN ERROR EN LA BUSQUEDA
        if (err) {
            return res.status(200).json({
                error: true,
                mensaje: "Error al buscar producto",
                errorType: err
            });
        }
        //VALIDAMOS SI EXISTE EL PRODUCTO
        if (prod) {
            // ELIMINAMOS EL ARCHIVO GUARDADO TEMPORALMENTE
            fs_1.default.unlink(archivo.path, (error) => {
                if (error) {
                    return res.status(200).json({
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
            //SI TODO SALE BIEN Y NO EXISTE EL PRODUCTO
            //GENERA UN ARRAY POR CADA PUNTO DEL NOMBRE DEL ARCHIVO
            var nombreCortado = archivo.originalname.split('.');
            //TOMO EL ULTIMO PUNTO Y EXTRAIGO LA EXTENSION DEL ARCHIVO
            var extensionArchivo = nombreCortado[nombreCortado.length - 1];
            //NOMBE DE ARCHIVO PERSONALIZADO
            var nombreArchivo = `${body.nombre}-${body.empresa}.${extensionArchivo}`;
            //MOVER EL ARCHIVO DE UN TEMPORAL A UN PATH DEL SERVIDOR
            var dir = `${resolve}/${body.empresa}/${nombreArchivo}`;
            //SI NO EXISTE EL DIRECTORIO DE LA EMPRESA, LO CREAMOS
            if (!fs_1.default.existsSync(`${resolve}/${body.empresa}`)) {
                fs_1.default.mkdirSync(`${resolve}/${body.empresa}`);
            }
            fs_1.default.rename(archivo.path, dir, (err) => {
                if (err) {
                    return res.status(200).json({
                        error: true,
                        mensaje: 'Ocurrio un error al renombrar el archivo.',
                        err: err
                    });
                }
                else {
                    // OPTIMIZAR LA IMAGEN
                    Jimp.read(dir, (err, newImage) => {
                        newImage
                            .quality(70) // set quality
                            .resize(800, Jimp.AUTO)
                            .write(dir); // save
                        //GUARDAMOS LA IMAGEN EN BASE DE DATOS
                        //AQUI DEBES COLOCAR EN EL FRONTEN http://166.62.103.25:5000/directorioImagen
                        let directorioImagen = `uploads/${body.empresa}/${nombreArchivo}`;
                        //RECIBIR DATOS POR POST(BODY) Y ASIGARLOS AL OBJETO PRODUCTO
                        let nuevo_producto = new producto_1.Producto({
                            nombre: body.nombre + '-' + body.empresa,
                            nombre_comercial: body.nombre,
                            descripcion: body.descripcion,
                            categoria: body.categoria,
                            empresa: body.empresa,
                            imagen: directorioImagen,
                            extension: extensionArchivo
                        });
                        //SI TODO SALE BIEN, CREAMOS EL PRODUCTO
                        producto_1.Producto.create(nuevo_producto, (err, new_prod) => {
                            if (err) {
                                return res.status(200).json({
                                    error: true,
                                    mensaje: "Hubo un error al crear el documento producto.",
                                    errorType: err
                                });
                            }
                            return res.status(200).json({
                                error: false,
                                producto: new_prod
                            });
                        });
                    });
                }
            });
        }
    });
});
exports.route_productoUpload = router;
