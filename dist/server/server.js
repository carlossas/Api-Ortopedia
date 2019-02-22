"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
//LIBRERIA EXPRESS
const express_1 = __importDefault(require("express"));
//VARIABLES GLOBALES (PUERTO)
const environment_1 = require("../global/environment");
//LIBRERIA SOCKETS
const socket_io_1 = __importDefault(require("socket.io"));
//HTTP
const http_1 = __importDefault(require("http"));
//BODY PARSER ( Permite usar envio de formularios en JSON )
const body_parser_1 = __importDefault(require("body-parser"));
//PATH
const path_1 = __importDefault(require("path"));
//FUNCIONES DE SOCKET
const socketService = __importStar(require("../sockets/sockets"));
class Server {
    constructor() {
        //SERVIDOR EXPRESS
        this.app = express_1.default();
        //PUERTO DE LA APP
        this.port = environment_1.SERVER_PORT;
        //SERVIDOR HTTP
        this.httpServer = new http_1.default.Server(this.app);
        //OBJETO IO DE SOCKET
        this.io = socket_io_1.default(this.httpServer);
        //OPCIONES DE CORS
        this.cors();
        //BODY PARSE
        // this.bodyParser();  !!!!!!!!!!!!!!ESTA GENERANDO ERROR CON LOS ARCHIVOS EN EL UPLOAD
        //INICIAR EL SERVICIO DE SOCKET
        // this.escucharSockets();
        //CONTENIDO HTML
        this.publicFolder();
    }
    //RETORNA LA INSTANCIA DE LA CLASE O CREA UNA NUEVA SI NO EXISTE
    static get instance() {
        return this._instance || (this._instance = new this());
    }
    //ESCUCHAR SOCKETS
    escucharSockets() {
        console.log("escuchando conexiones");
        this.io.on('connection', (cliente) => {
            console.log("conectado a socket");
            //Desconectar cliente
            socketService.desconectar(cliente);
        });
    }
    //FUNCION PARA ACCEDER AL FOLDER PUBLIC
    publicFolder() {
        const publicPath = path_1.default.resolve(__dirname, '../public');
        this.app.use(express_1.default.static(publicPath));
    }
    //BODYPARSE 
    bodyParser() {
        this.app.use(body_parser_1.default.urlencoded({ extended: false }));
        this.app.use(body_parser_1.default.json());
    }
    //CONFIGURACION DE CORS
    cors() {
        //CONFIGURACION DE CORS VPS
        this.app.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
        //CONFIGURACION DE CORS LOCAL
        // this.app.use( cors );
    }
    //INICIAR EL SERVIDOR
    start(callback) {
        this.httpServer.listen(this.port, callback);
    }
}
exports.default = Server;
