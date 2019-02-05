import { Router, Request, Response } from 'express';
//MYSQL
import MySQL from '../mysql/mysql'; /////////////////ELIMINAR
//CONEXION DE MONGODB
import MongoDB from '../mongodb/mongodb';
//MODELO/SCHEMA DEL PRODUCTO
import { Producto } from '../mongodb/models/producto';
//MIDDLEWARE
import mdAutenticacion from '../middlewares/autenticacion';
//SEED
import { SEED } from '../config/config';
//EXPRESS JS
import express from 'express';
//LIBRERIA DE EXPRESS PARA MANEJAR ARCHIVOS AL SERVIDOR
import fileUpload from 'express-fileupload';
//FILE SYSTEM DE NODE
import fs from 'fs';
//PATH
import path from 'path';
//OPTIMIZADOR DE IMAGENES
var Jimp  = require('jimp');

//MANEJADOR DE FORM-DATA
var multer  = require('multer');

//LOCALIZAR EL DIRECTORIO ACTUAL Y DESTINAR LA CARPETA DE IMAGENES A ESE PATH
var resolve = path.resolve(__dirname, '../public/uploads')
var upload = multer({ 
    dest: resolve
});

var app = express();

// Opciones por default del modulo fileupload
app.use(fileUpload());

//NUEVA INSTANCIA DE MONGO
MongoDB.instance;

var router = Router();

// ==========================================
// Subir un nuevo producto
// ==========================================
router.post( '/nuevoproducto', mdAutenticacion, upload.single('imagen'),  (req: any, res: Response) =>{

    var body = req.body;

    if (!req.file) {
        
        return res.status(200).json({
            error: true,
            mensaje: 'No hay archivos seleccionados'
        });
        
    }

    //OBTENER NOMBRE DEL ARCHIVO
    var archivo: any = req.file;

    //VALIDAMOS QUE NO EXISTA UN PRODUCTO LLAMADO IGUAL
    Producto.findOne({ nombre:  body.nombre + '-' + body.empresa}, (err:any, prod: any)=>{
        //SI SURGE UN ERROR EN LA BUSQUEDA
        if(err){
            return res.status(200).json({
                error: true,
                mensaje: "Error al buscar producto",
                errorType: err
            });
        }

        //VALIDAMOS SI EXISTE EL PRODUCTO
        if(prod){
            // ELIMINAMOS EL ARCHIVO GUARDADO TEMPORALMENTE
            fs.unlink(archivo.path, (error: any)=> {
                if (error){
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
            
        }else{
            //SI TODO SALE BIEN Y NO EXISTE EL PRODUCTO

            //GENERA UN ARRAY POR CADA PUNTO DEL NOMBRE DEL ARCHIVO
            var nombreCortado = archivo.originalname.split('.');
            //TOMO EL ULTIMO PUNTO Y EXTRAIGO LA EXTENSION DEL ARCHIVO
            var extensionArchivo = nombreCortado[nombreCortado.length - 1];
        
            //NOMBE DE ARCHIVO PERSONALIZADO
            var nombreArchivo = `${ body.nombre }-${ body.empresa }.${ extensionArchivo }`;
        
            //MOVER EL ARCHIVO DE UN TEMPORAL A UN PATH DEL SERVIDOR
            var dir = `${resolve}/${ body.empresa }/${ nombreArchivo }`;
        
            //SI NO EXISTE EL DIRECTORIO DE LA EMPRESA, LO CREAMOS
            if (!fs.existsSync(`${resolve}/${ body.empresa }`)){
                fs.mkdirSync(`${resolve}/${ body.empresa }`);
            }
            
            fs.rename(archivo.path, dir, (err: any)=> {
                if (err){
                    return res.status(200).json({
                        error: true,
                        mensaje: 'Ocurrio un error al renombrar el archivo.',
                        err: err
                    });
                }else{
                    // OPTIMIZAR LA IMAGEN
                    Jimp.read(dir, (err:any, newImage: any) => {
                        
                        newImage
                          .quality(70) // set quality
                          .resize(800, Jimp.AUTO)
                          .write(dir); // save
        
        
                        //GUARDAMOS LA IMAGEN EN BASE DE DATOS
                        //AQUI DEBES COLOCAR EN EL FRONTEN http://166.62.103.25:5000/directorioImagen
                        let directorioImagen = `uploads/${ body.empresa }/${ nombreArchivo }`;
        
                        //RECIBIR DATOS POR POST(BODY) Y ASIGARLOS AL OBJETO PRODUCTO
                        let nuevo_producto = new Producto ({
                            nombre: body.nombre + '-' + body.empresa,
                            nombre_comercial: body.nombre,
                            descripcion: body.descripcion,
                            categoria: body.categoria,
                            empresa: body.empresa,
                            imagen: directorioImagen,
                            extension: extensionArchivo
                        });
        
                        //SI TODO SALE BIEN, CREAMOS EL USUARIO
                        Producto.create(nuevo_producto, (err: any, new_prod: any)=>{
            
                            if(err){
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

export const route_productoUpload = router;