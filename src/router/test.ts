import { Router, Request, Response } from 'express';
//MYSQL
import MySQL from '../mysql/mysql';

const _mysql = Router();

//OBTIENE TODOS LOS HEROES
_mysql.get( '/heroes_mysql', (req: Request, res: Response) =>{
    //CONSULTA A MYSQL
    let consulta = 
    `
        SELECT * FROM HEROES
    `;

    MySQL.ejecutarConsulta(consulta, (err:any, datos: Object[])=>{
        //SI EXISTE UN ERROR
        if(err){
            res.status(400).json({
                error: true,
                mensaje: err
            });
        }else{
            res.json({
                error: false,
                datos
            });
        }

    });

});

//OBTIENE UN HEROE POR ID
_mysql.get( '/heroes/:id', (req: Request, res: Response) =>{
    //LEEMOS EL ID QUE VIENE POR URL
    let id = req.params.id;
    //ESCAPE DE MYSQL
    //NO ENTENDI PARA QUE ES :P
    let escapeId = MySQL.instance.conexion.escape(id);

    //CONSULTA A MYSQL
    let consulta = 
    `
        SELECT * FROM HEROES WHERE id = ${escapeId}
    `;

    MySQL.ejecutarConsulta(consulta, (err:any, datos: Object[])=>{
        //SI EXISTE UN ERROR
        if(err){
            res.status(400).json({
                error: true,
                mensaje: err
            });
        }else{
            res.json({
                error: false,
                datos: datos[0] //accedo solo a uno por id, así que puedo acceder al primer elemento
            });
        }

    });

});

export const route_mysql = _mysql;