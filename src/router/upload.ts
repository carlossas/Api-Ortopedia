import { Router, Request, Response } from 'express';
//MYSQL
import MySQL from '../mysql/mysql';
//EXPRESS JS
import express from 'express';
//LIBRERIA DE EXPRESS PARA MANEJAR ARCHIVOS AL SERVIDOR
import fileUpload from 'express-fileupload';
//FILE SYSTEM DE NODE
import fs from 'fs';

//MANEJADOR DE FORM-DATA
var multer  = require('multer');
var upload = multer({ 
    dest: 'src/uploads/'
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

    console.log(req.file);

    if (!req.file) {
        
        return res.status(400).json({
            ok: false,
            mensaje: 'No hay archivos seleccionados'
        });
        
    }

    //OBTENER NOMBRE DEL ARCHIVO
    var archivo: any = req.file;

    //GENERA UN ARRAY POR CADA PUNTO DEL NOMBRE DEL ARCHIVO
    var nombreCortado = archivo.originalname.split('.');
    //TOMO EL ULTIMO PUNTO Y EXTRAIGO LA EXTENSION DEL ARCHIVO
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    //NOMBE DE ARCHIVO PERSONALIZADO
    var nombreArchivo = `${ producto.nombre }-${ producto.empresa }.${ extensionArchivo }`;

    //MOVER EL ARCHIVO DE UN TEMPORAL A UN PATH DEL SERVIDOR
    var path = `src\\uploads\\${ producto.empresa }\\${ nombreArchivo }`;

    //SI NO EXISTE EL DIRECTORIO DE LA EMPRESA, LO CREAMOS
    if (!fs.existsSync(`src\\uploads\\${ producto.empresa }`)){
        fs.mkdirSync(`src\\uploads\\${ producto.empresa }`);
    }
    
    fs.rename(archivo.path, path, (err)=> {
        if (err) throw err;
        console.log('File Renamed!');
    });
    

    return res.status(500).json({
        ok: true,
        mensaje: 'correcto',
    });

});

export const route_upload = router;