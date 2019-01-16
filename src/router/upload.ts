import { Router, Request, Response } from 'express';
//MYSQL
import MySQL from '../mysql/mysql';
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

var router = Router();

router.post( '/upload', upload.single('imagen'),  (req: any, res: Response) =>{

    

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
    var archivo: any = req.file;

    //VALIDAMOS QUE NO EXISTA UN PRODUCTO LLAMADO IGUAL
    let validarNombre = `
        SELECT * FROM productos WHERE nombre = '${producto.nombre}' && empresa = '${producto.empresa}'
    `;

    MySQL.ejecutarConsulta(validarNombre, (err:any, datos: Object[])=>{
        //SI EXISTE UN ERROR
        if(err){
            return res.status(200).json({
                error: true,
                mensaje: err
            });
        }

        if(datos){
            
            // ELIMINAMOS EL ARCHIVO GUARDADO TEMPORALMENTE
            fs.unlink(archivo.path, (error)=> {
                if (error){
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
                
            
        }else{

            //GENERA UN ARRAY POR CADA PUNTO DEL NOMBRE DEL ARCHIVO
            var nombreCortado = archivo.originalname.split('.');
            //TOMO EL ULTIMO PUNTO Y EXTRAIGO LA EXTENSION DEL ARCHIVO
            var extensionArchivo = nombreCortado[nombreCortado.length - 1];
        
            //NOMBE DE ARCHIVO PERSONALIZADO
            var nombreArchivo = `${ producto.nombre }-${ producto.empresa }.${ extensionArchivo }`;
        
            //MOVER EL ARCHIVO DE UN TEMPORAL A UN PATH DEL SERVIDOR
            var dir = `${resolve}/${ producto.empresa }/${ nombreArchivo }`;
        
            //SI NO EXISTE EL DIRECTORIO DE LA EMPRESA, LO CREAMOS
            if (!fs.existsSync(`${resolve}/${ producto.empresa }`)){
                fs.mkdirSync(`${resolve}/${ producto.empresa }`);
            }
            
            fs.rename(archivo.path, dir, (err)=> {
                if (err){
                    return res.status(200).json({
                        error: true,
                        mensaje: 'Ocurrio un error al renombrar el archivo.'
                    });
                } 
            });

            // OPTIMIZAR LA IMAGEN
            Jimp.read(dir, (err:any, newImage: any) => {
                if (err){
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
                let directorioImagen = `localhost:5000/uploads/${ producto.empresa }/${ nombreArchivo }`;
            
                //CONSULTA A MYSQL
                let consulta = 
            
                `
                    INSERT INTO productos (nombre, descripcion, categoria, empresa, imagen) 
                    VALUES ('${producto.nombre}', '${producto.descripcion}', '${producto.categoria}', '${producto.empresa}', '${directorioImagen}')
                `;
            
                MySQL.ejecutarConsulta(consulta, (err:any, datos: Object[])=>{
                    //SI EXISTE UN ERROR
                    if(err){
                        return res.status(200).json({
                            error: true,
                            mensaje: err
                        });
                    }else{
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

export const route_upload = router;