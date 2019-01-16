"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql = require("mysql");
class MySQL {
    constructor() {
        this.conectado = false;
        console.log("Clase inicializada");
        this.conexion = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'adminadmin123',
            database: 'krusty_servicios'
        });
        this.validarConexion();
    }
    //GENERA UNA INSTANCIA DE LA CLASE, Y SI NO EXISTE CREA UNA NUEVA
    //PATRON SINGLETON
    static get instance() {
        return this._instance || (this._instance = new this());
    }
    //EJECUTA UNA CONSULTA
    static ejecutarConsulta(query, callback) {
        this.instance.conexion.query(query, (err, results, fields) => {
            //SI ENCONTRAMOS UN ERROR DE SINTAXIS
            if (err) {
                console.log("Error al ejecutar consulta", err);
                return callback(err);
            }
            //SI EL DATO BUSCADO NO EXISTE
            if (results.length === 0) {
                callback(null, null);
            }
            else {
                //TODO SALIO BIEN
                callback(null, results);
            }
        });
    }
    //VALIDAMOS LA CONEXION Y SI ES CORRECTA, ENTRAMOS
    validarConexion() {
        this.conexion.connect((error) => {
            if (error) {
                console.log("Error al conectarse: ", error.message);
                return;
            }
            this.conectado = true;
            console.log("Base de datos online MYSQL");
        });
    }
}
exports.default = MySQL;
