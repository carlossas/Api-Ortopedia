import { Router, Request, Response } from 'express';
import MySQL from '../mysql/mysql';

var router = Router();

MySQL.instance;

router.get( '/usuario', (req: Request, res: Response) =>{


    //RECIBIR DATOS POR PARAMETROS
    // const id = req.params.id;

    //RECIBIR DATOS POR POST(BODY)
    // let id = req.body.id;

    // var body = req.body;
    let consulta = 'SELECT * FROM `usuarios`';

    MySQL.ejecutarConsulta(consulta, (err: any, datos: any)=>{
        if(err){
            return res.status(400).json({
                error: true,
                mensaje: err
            });
        }else{
            return res.status(200).json({
                error: false,
                mensaje: "Todo esta bien",
                datos: datos
            });
        }
    });

    

});

export const route_index = router;