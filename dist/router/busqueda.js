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
//USAR BODY PARSER EN ESTA RUTA
const server_1 = __importDefault(require("../server/server"));
const server = server_1.default.instance;
server.bodyParser();
mongodb_1.default.instance;
var router = express_1.Router();
// ==========================================
// BUSCAR EN CUALQUIER COLLECCION
// ==========================================
router.get('/buscar/:empresa/:tabla/:limit/:busqueda', (req, res) => {
    var empresa = req.params.empresa;
    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var promesa;
    var limit = req.params.limit || 5;
    var desde = req.query.desde || 0;
    desde = Number(desde);
    limit = Number(limit);
    //FUNCION DE JS QUE DEVUELVE UNA EXPRESION REGULAR,(VARIABLE Y STRING), PARA SER USADA DESPUES
    var regex = new RegExp(busqueda, 'i');
    //DETERMINAMOS EN QUE TABLA BUSCAR
    switch (tabla) {
        case 'productos':
            promesa = buscarProductos(empresa, busqueda, regex, limit, desde);
            break;
        default:
            return res.status(400).json({
                error: true,
                mensaje: 'Los tipos de busqueda solo son productos',
                err: { message: 'Tipo de tabla/colección no valida' }
            });
            break;
    }
    promesa.then((data) => {
        return res.status(200).json({
            error: false,
            [tabla]: data.productos,
            total: data.conteo
        });
    }).catch((err) => {
        return res.status(200).json({
            error: true,
            err: err
        });
    });
});
//FUNCONES DE BUSQUEDA
function buscarProductos(empresa, busqueda, regex, limit, desde) {
    return new Promise((resolved, reject) => {
        //FUNCION QUE BUSCA UN DATO DENTRO DEL CAMPO QUE SE LE INDIQUE
        producto_1.Producto.find({ empresa: empresa })
            //AQUI SE EJECUTAN LOS CAMPOS EN LOS QUE DESEO QUE COINCIDA LA BUSQUEDA
            .or([{ 'nombre': regex }, { 'categoria': regex }, { 'descripcion': regex }])
            .skip(desde)
            .limit(limit)
            .exec((err, productos) => {
            if (err) {
                let newErr = {
                    mensaje: 'Error al cargar productos',
                    err: err
                };
                reject(newErr);
            }
            else {
                producto_1.Producto.count({}, (err, conteo) => {
                    var resultados = {
                        productos: productos,
                        conteo: conteo
                    };
                    resolved(resultados);
                });
            }
        });
    });
}
exports.route_busqueda = router;
