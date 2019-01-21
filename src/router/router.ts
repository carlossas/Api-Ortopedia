import { Router, Request, Response } from 'express';

var router = Router();

router.get( '/', (req: Request, res: Response) =>{


    //RECIBIR DATOS POR PARAMETROS
    // const id = req.params.id;

    //RECIBIR DATOS POR POST(BODY)
    // let id = req.body.id;

    // var body = req.body;

    return res.status(200).json({
        ok: true,
        mensaje: "Todo esta bien"
    });

});

export const route_index = router;