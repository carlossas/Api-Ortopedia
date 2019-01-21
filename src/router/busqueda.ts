import { Router, Request, Response } from 'express';
//MODELO
import { Producto } from '../mongodb/models/producto';
//CONEXION DE MONGODB
import MongoDB from '../mongodb/mongodb';
//USAR BODY PARSER EN ESTA RUTA
import Server from '../server/server';
const server = Server.instance;
server.bodyParser();


MongoDB.instance;
var router = Router();


// ==========================================
// BUSCAR EN CUALQUIER COLLECCION
// ==========================================
router.get('/buscar/:empresa/:tabla/:busqueda', (req: Request, res: Response) => {
    var empresa = req.params.empresa;
    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;
    var promesa: any;
    //FUNCION DE JS QUE DEVUELVE UNA EXPRESION REGULAR,(VARIABLE Y STRING), PARA SER USADA DESPUES
    var regex = new RegExp(busqueda, 'i')
    
    //DETERMINAMOS EN QUE TABLA BUSCAR
    switch (tabla) {
        case 'productos':
            promesa = buscarProductos(empresa, busqueda, regex)
            break;

        default:
            return res.status(400).json({
                error: true,
                mensaje: 'Los tipos de busqueda solo son productos',
                err: { message: 'Tipo de tabla/colección no valida' }
            });
            break;
    }

    promesa.then((data: any) => {
        return res.status(200).json({
            error: false,
            [tabla]: data
        });
    }).catch( (err: any)=>{
        return res.status(200).json({
            error: true,
            err: err
        });
    });
    
});


//FUNCONES DE BUSQUEDA
function buscarProductos(empresa: any, busqueda: any, regex: any) {

    return new Promise((resolved, reject) => {

        //FUNCION QUE BUSCA UN DATO DENTRO DEL CAMPO QUE SE LE INDIQUE
        Producto.find({empresa: empresa})
            //AQUI SE EJECUTAN LOS CAMPOS EN LOS QUE DESEO QUE COINCIDA LA BUSQUEDA
            .or([{ 'nombre': regex }, { 'categoria': regex }, { 'descripcion': regex }])
            .exec((err, productos) => {
                if (err) {
                    let newErr = {
                        mensaje:'Error al cargar productos',
                        err: err
                    }
                    reject(newErr)
                } else {
                    resolved(productos)
                }
            })
    });

}




export const route_busqueda = router;