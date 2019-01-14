"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
//MYSQL
const mysql_1 = __importDefault(require("../mysql/mysql"));
const _mysql = express_1.Router();
//OBTIENE TODOS LOS HEROES
_mysql.get('/heroes_mysql', (req, res) => {
    //CONSULTA A MYSQL
    let consulta = `
        SELECT * FROM HEROES
    `;
    mysql_1.default.ejecutarConsulta(consulta, (err, datos) => {
        //SI EXISTE UN ERROR
        if (err) {
            res.status(400).json({
                error: true,
                mensaje: err
            });
        }
        else {
            res.json({
                error: false,
                datos
            });
        }
    });
});
//OBTIENE UN HEROE POR ID
_mysql.get('/heroes/:id', (req, res) => {
    //LEEMOS EL ID QUE VIENE POR URL
    let id = req.params.id;
    //ESCAPE DE MYSQL
    //NO ENTENDI PARA QUE ES :P
    let escapeId = mysql_1.default.instance.conexion.escape(id);
    //CONSULTA A MYSQL
    let consulta = `
        SELECT * FROM HEROES WHERE id = ${escapeId}
    `;
    mysql_1.default.ejecutarConsulta(consulta, (err, datos) => {
        //SI EXISTE UN ERROR
        if (err) {
            res.status(400).json({
                error: true,
                mensaje: err
            });
        }
        else {
            res.json({
                error: false,
                datos: datos[0] //accedo solo a uno por id, así que puedo acceder al primer elemento
            });
        }
    });
});
exports.route_mysql = _mysql;
