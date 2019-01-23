import { Router, Request, Response } from 'express';
//MODELO
import { Empresa } from '../mongodb/models/empresa';
//CONEXION DE MONGODB
import MongoDB from '../mongodb/mongodb';
//USAR BODY PARSER EN ESTA RUTA
import Server from '../server/server';
const server = Server.instance;
server.bodyParser();

MongoDB.instance;
var router = Router();


// ==========================================
// INGRESAR UNA NUEVA EMPRESA
// ==========================================
router.post('/nuevaempresa', (req: Request, res: Response) => {

    var body = req.body;

    //CREAMOS LA ENTIDAD EMPRESA CON LOS DATOS RECIBIDOS POR POST
    var nueva_empresa = new Empresa ({
        nombre: body.nombre,
        categorias: body.categorias
    });

    Empresa.findOne({ nombre: body.nombre }, (err: any, datos: any) =>{
        //SI SURGE UN ERROR EN LA BUSQUEDA
        if(err){
            return res.status(200).json({
                error: true,
                mensaje: "Error al buscar usuario",
                errorType: err
            });
        }

        //VALIDAMOS SI EXISTE EL USUARIO
        if(datos){
            return res.status(200).json({
                error: true,
                mensaje: "Este nombre de empresa ya existe en la base de datos."
            });
        }else{
            //SI NO ENCONTRAMOS NADA, GUARDAMOS LA EMPRESA EN LA BASE DE DATOS
            Empresa.create(nueva_empresa, (err: any, new_company: any)=>{

                //SI SURGE UN ERROR EN LA BUSQUEDA
                if(err){
                    return res.status(200).json({
                        error: true,
                        mensaje: "Error al buscar usuario",
                        errorType: err
                    });
                }else{
                    return res.status(200).json({
                        error: false,
                        mensaje: 'Empresa ingresada con exito.',
                        new_company: new_company
                    });
                }


            });
        }

    });
    
});



// ==========================================
// OBTENER EMPRESAS
// ==========================================
router.get('/obtener_empresas', (req: Request, res: Response) => {

    Empresa.find({}, (err: any, empresas: any)=>{

        //SI SURGE UN ERROR EN LA BUSQUEDA
        if(err){
            return res.status(200).json({
                error: true,
                mensaje: "Error al buscar empresas",
                errorType: err
            });
        }else{
            return res.status(200).json({
                error: false,
                empresas: empresas
            });
        }

    });
    
});







export const route_empresa = router;