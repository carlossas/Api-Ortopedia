import { Router, Request, Response } from 'express';
// JSON WEB TOKEN
import jwt from 'jsonwebtoken';
//ENCRIPTADOR DE CONTRASEÑAS
import bcrypt from 'bcryptjs';
//MODELO
import { Usuario } from '../mongodb/models/usuario';
//CONEXION DE MONGODB
import MongoDB from '../mongodb/mongodb';
//MIDDLEWARE
import mdAutenticacion from '../middlewares/autenticacion';
//SEED
import { SEED } from '../config/config';
//USAR BODY PARSER EN ESTA RUTA
import Server from '../server/server';
const server = Server.instance;
server.bodyParser();


MongoDB.instance;
var router = Router();

// ==========================================
// Crear un nuevo usuario
// ==========================================
// router.post('/registrar', mdAutenticacion, (req: Request, res: Response) => {
router.post('/registrar', /* mdAutenticacion, */ (req: Request, res: Response) => {

    var body = req.body;
    
    //ASIGNA LOS DATOS DEL USUARIO QUE FUERON ENVIADOS A TRAVES DEL FORMULARIO POR MEDIO DE REQ.BODY
    var nuevo_Usuario = new Usuario ({
        nombre: body.nombre,
        nombre_usuario: body.nombre_usuario,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role,
        empresa: body.empresa
    });

    //BUSCAMOS QUE ESTE USUARIO NO EXISTA EN LA BASE DE DATOS
    Usuario.findOne({ nombre_usuario:  body.nombre_usuario}, (err:any, user: any)=>{
        //SI SURGE UN ERROR EN LA BUSQUEDA
        if(err){
            return res.status(200).json({
                error: true,
                mensaje: "Error al buscar usuario",
                errorType: err
            });
        }
        //VALIDAMOS SI EXISTE EL USUARIO
        if(user){
            return res.status(200).json({
                error: true,
                mensaje: "Este nombre de usuario ya existe en la base de datos."
            });
        }else{
            //SI TODO SALE BIEN, CREAMOS EL USUARIO
            Usuario.create(nuevo_Usuario, (err: any, new_user: any)=>{

                if(err){
                    return res.status(200).json({
                        error: true,
                        mensaje: "Hubo un error al crear el usuario",
                        errorType: err
                    });
                }

                // Crear un token!!!
                new_user.password = 'k mira prro';

                return res.status(200).json({
                    error: false,
                    usuario: new_user
                });

            });
        }

    });

    
});



// ==========================================
// INGRESAR
// ==========================================
router.post( '/login', (req: Request, res: Response) =>{

    var body = req.body;

    Usuario.findOne({ nombre_usuario: body.nombre_usuario }, (err: any, usuarioDB: any) => {

        if (err) {
            return res.status(200).json({
                error: true,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!usuarioDB) {
            return res.status(200).json({
                error: true,
                mensaje: 'Credenciales incorrectas - email',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(200).json({
                error: true,
                mensaje: 'Credenciales incorrectas - password',
                errors: err
            });
        }

        // Crear un token!!!
        usuarioDB.password = 'k mira prro';

        
        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }); // 4 horas

        res.status(200).json({
            error: false,
            usuario: usuarioDB,
            token: token,
            id: usuarioDB._id
        });

    });

    

});

export const route_usuario = router;