import jwt from 'jsonwebtoken';

import { SEED } from '../config/config';

// ==========================================
//  Verificar token
// ==========================================
var verificarToken = (req: any, res: any, next: any) => {

    var token = req.query.token;

    jwt.verify(token, SEED, (err: any, decoded: any) => {

        if (err) {
            return res.status(200).json({
                error: true,
                mensaje: 'Token incorrecto',
                errors: err
            });
        }

        req.usuario = decoded.usuario;

        next();


    });

}

export default verificarToken;