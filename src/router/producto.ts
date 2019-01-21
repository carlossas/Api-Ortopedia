import { Router, Request, Response } from 'express';
//MODELO
import { Producto } from '../mongodb/models/producto';
//CONEXION DE MONGODB
import MongoDB from '../mongodb/mongodb';
//COMPROBAR TOKEN
import mdAutenticacion from '../middlewares/autenticacion';
//USAR BODY PARSER EN ESTA RUTA
import Server from '../server/server';
//FILE SYSTEM DE NODE
import fs from 'fs';
//PATH
import path from 'path';

//LOCALIZAR EL DIRECTORIO ACTUAL Y DESTINAR LA CARPETA DE IMAGENES A ESE PATH
var resolve = path.resolve(__dirname, '../public/uploads');

//CREAR INSTANCIA DEL SERVIDOR 
const server = Server.instance;
server.bodyParser();


MongoDB.instance;
var router = Router();

// ==========================================
// Obtener todos los productos
// ==========================================
router.get('/obtenerproductos/:empresa', (req: Request, res: Response) => {
    var empresa = req.params.empresa;
    var desde = req.query.desde || 0;
    desde = Number(desde);
    //BUSQUEDA Y CAMPOS QUE DESEA OBTENER, SI NO SE DEFINE DEVUELVE TODOS LOS CAMPOS
    Producto.find({empresa: empresa})
        .skip(desde)
        .limit(5)
        .exec(
            (err: any, productos: any) => {

                if (err) {
                    return res.status(500).json({
                        error: true,
                        mensaje: 'Error al buscar productos',
                        errors: err
                    });
                }

                console.log(productos);

                Producto.count({}, (err: any, conteo: any) => {
                    return res.status(200).json({
                        error: false,
                        productos: productos,
                        total: conteo
                    });
                })

            });

    
});

router.delete('/borrarProducto/:id', mdAutenticacion, (req: Request, res: Response) => {

    var id = req.params.id;

    Producto.findOneAndDelete(id, (err, productoBorrado: any) => {

        if (err) {
            return res.status(500).json({
                error: true,
                mensaje: 'Error al borrar el producto',
                errors: err
            });
        }

        if (!productoBorrado) {
            return res.status(400).json({
                error: true,
                mensaje: 'No existe un prodcuto con ese id',
                errors: { message: 'No existe un producto con ese id' }
            });
        }else{

            // ELIMINAMOS EL ARCHIVO GUARDADO TEMPORALMENTE
            let directorioImagen = resolve + '/' + productoBorrado.empresa + '/' + productoBorrado.nombre + '.' + productoBorrado.extension;
            
            fs.unlink(directorioImagen, (error: any)=> {
                if (error){
                    return res.status(200).json({
                        ok: false,
                        mensaje: 'Ocurrio un error al borrar la imagen',
                        error: error
                    });
                }
    
                return res.status(200).json({
                    error: false,
                    producto: productoBorrado
                });
        
            });
    

        }

        
        
    });

});

export const route_producto = router;