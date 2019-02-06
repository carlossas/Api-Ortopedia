import { Router, Request, Response } from 'express';
//MODELO
import { Empresa } from '../mongodb/models/empresa';
//CONEXION DE MONGODB
import MongoDB from '../mongodb/mongodb';
//USAR BODY PARSER EN ESTA RUTA
import Server from '../server/server';
const server = Server.instance;
server.bodyParser();
//MIDDLEWARE
import mdAutenticacion from '../middlewares/autenticacion'

MongoDB.instance;
var router = Router();


// ==========================================
// INGRESAR UNA NUEVA EMPRESA
// ==========================================
router.post('/nuevaempresa', mdAutenticacion, (req: Request, res: Response) => {

    var body = req.body;

    
});



// ==========================================
// OBTENER EMPRESAS
// ==========================================








export const route_inventario = router;