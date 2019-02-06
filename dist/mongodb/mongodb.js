"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
class MongoDB {
    constructor() {
        this.conectado = false;
        console.log("Clase inicializada");
        // const URL = 'mongodb://krustyowner:krustyistheking2019@localhost:27017/krusty_servicios';
        //LOCAL
        const URL = 'mongodb://localhost:27017/krusty_servicios';
        //DATOS DE CONEXION
        let options = {
            useNewUrlParser: true,
            useCreateIndex: true
        };
        this.conectar(URL, options);
    }
    //GENERA UNA INSTANCIA DE LA CLASE, Y SI NO EXISTE CREA UNA NUEVA
    //PATRON SINGLETON
    static get instance() {
        return this._instance || (this._instance = new this());
    }
    //
    static obtenerTodos(schema, desde, callback) {
        //CREAMOS UNA INSTANCIA
        this.instance.conexion;
        //BUSQUEDA Y CAMPOS QUE DESEA OBTENER, SI NO SE DEFINE DEVUELVE TODOS LOS CAMPOS
        schema
            .find({})
            .skip(desde)
            .limit(5)
            .exec((err, datos) => {
            if (err) {
                return callback(err);
            }
            schema.count({}, (err, conteo) => {
                //TODO SALIO BIEN
                callback(null, datos, conteo);
            });
        });
    }
    //VALIDAMOS LA CONEXION Y SI ES CORRECTA, ENTRAMOS
    conectar(URL, options) {
        this.conexion = mongoose_1.default.connect(URL, options, (err) => {
            if (err)
                throw err;
            else {
                console.log("BASE DE DATOS ONLINE MONGO DB");
                this.conectado = true;
            }
        });
    }
}
exports.default = MongoDB;
