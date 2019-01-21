"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//EJEMPLO DE CORS
var cors = require('cors');
// var whitelist = "http://localhost:8100";
var whitelist = ['http://localhost:8100', 'http://localhost:4200'];
const corsOptions = {
    origin: function (origin, callback) {
        //El "|| !origin" permite todos los accesos
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            console.log("Conexion exitosa");
            callback(null, true);
        }
        else {
            console.error("No tiene permitido entrar");
            callback(new Error('CORS no permitidos'));
        }
    }
};
var Cors = cors();
exports.default = Cors;
