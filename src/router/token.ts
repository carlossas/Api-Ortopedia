import { Router, Request, Response } from 'express';
//MODELO
//USAR BODY PARSER EN ESTA RUTA
import Server from '../server/server';
const server = Server.instance;
server.bodyParser();
//COMPROBAR TOKEN
import mdAutenticacion from '../middlewares/autenticacion';

var router = Router();

router.get('/verificarToken', mdAutenticacion, (req: Request, res: Response) => {
    return res.status(200).json({
        error: false,
        mensaje: 'Token valido'
    });
});

export const route_token = router;
