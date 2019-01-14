import { Router, Request, Response } from 'express';

const router = Router();

router.get( '/', (req: Request, res: Response) =>{

    // const id = req.params.id;

    res.json({
        ok: true,
        mensaje: "Todo esta bien"
    });

});

export const route_index = router;