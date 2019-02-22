"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
//MODELO
const producto_1 = require("../mongodb/models/producto");
//CONEXION DE MONGODB
const mongodb_1 = __importDefault(require("../mongodb/mongodb"));
//COMPROBAR TOKEN
const autenticacion_1 = __importDefault(require("../middlewares/autenticacion"));
//USAR BODY PARSER EN ESTA RUTA
const server_1 = __importDefault(require("../server/server"));
//FILE SYSTEM DE NODE
const fs_1 = __importDefault(require("fs"));
//PATH
const path_1 = __importDefault(require("path"));
//LOCALIZAR EL DIRECTORIO ACTUAL Y DESTINAR LA CARPETA DE IMAGENES A ESE PATH
var resolve = path_1.default.resolve(__dirname, '../public/uploads');
//CREAR INSTANCIA DEL SERVIDOR 
const server = server_1.default.instance;
server.bodyParser();
mongodb_1.default.instance;
var router = express_1.Router();
// ==========================================
// Obtener todos los productos
// ==========================================
router.get('/obtenerproductos/:empresa/:limit', (req, res) => {
    var empresa = req.params.empresa;
    var limit = req.params.limit || 5;
    var desde = req.query.desde || 0;
    desde = Number(desde);
    limit = Number(limit);
    //BUSQUEDA Y CAMPOS QUE DESEA OBTENER, SI NO SE DEFINE DEVUELVE TODOS LOS CAMPOS
    producto_1.Producto.find({ empresa: empresa })
        .skip(desde)
        .limit(limit)
        .exec((err, productos) => {
        if (err) {
            return res.status(500).json({
                error: true,
                mensaje: 'Error al buscar productos',
                errors: err
            });
        }
        // console.log(productos);
        producto_1.Producto.count({}, (err, conteo) => {
            return res.status(200).json({
                error: false,
                productos: productos,
                total: conteo
            });
        });
    });
});
// ==========================================
// EDITAR PRODUCTO POR ID
// ==========================================
router.post('/editarProducto/:id', autenticacion_1.default, (req, res) => {
    var id = req.params.id;
    var body = req.body;
    let query = {
        "descripcion": body.descripcion,
        "nombre_comercial": body.nombre_comercial,
        "nombre": body.nombre,
        "categoria": body.categoria
    };
    producto_1.Producto.findByIdAndUpdate(id, query, (err, productoEditado) => {
        if (err) {
            return res.status(500).json({
                error: true,
                mensaje: 'Error al editar el producto',
                errors: err
            });
        }
        else {
            return res.status(200).json({
                error: false,
                mensaje: 'Producto editado',
                producto: productoEditado
            });
        }
    });
});
// ==========================================
// ELIMINAR PRODUCTO POR ID
// ==========================================
router.post('/borrarProducto/:id', autenticacion_1.default, (req, res) => {
    var id = req.params.id;
    producto_1.Producto.findOneAndDelete(id, (err, productoBorrado) => {
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
        }
        else {
            // ELIMINAMOS EL ARCHIVO GUARDADO TEMPORALMENTE
            let directorioImagen = resolve + '/' + productoBorrado.empresa + '/' + productoBorrado.nombre + '.' + productoBorrado.extension;
            fs_1.default.unlink(directorioImagen, (error) => {
                if (error) {
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
exports.route_producto = router;
