"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//LIBRERIA EXPRESS
const express_1 = __importDefault(require("express"));
//VARIABLES GLOBALES (PUERTO)
const environment_1 = require("../global/environment");
//BODY PARSER ( Permite usar envio de formularios en JSON )
const body_parser_1 = __importDefault(require("body-parser"));
//PATH
const path_1 = __importDefault(require("path"));
//FS
const fs_1 = __importDefault(require("fs"));
//Https
const https_1 = __importDefault(require("https"));
class Server {
    //   public io: socketIO.Server;
    //   private httpServer: http.Server;
    constructor() {
        //SERVIDOR EXPRESS
        this.app = express_1.default();
        this.serverHttps = https_1.default.createServer({
            key: fs_1.default.readFileSync("/etc/letsencrypt/live/ortopediadelsureste.store/privkey.pem"),
            cert: fs_1.default.readFileSync("/etc/letsencrypt/live/ortopediadelsureste.store/cert.pem")
        }, this.app);
        //PUERTO DE LA APP
        this.port = environment_1.SERVER_PORT;
        //SERVIDOR HTTP
        // this.httpServer = new http.Server(this.app);
        //OBJETO IO DE SOCKET
        // this.io = socketIO(this.httpsServer);
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
    //   private escucharSockets() {
    //     console.log("escuchando conexiones");
    //     this.io.on("connection", (cliente: any) => {
    //       console.log("conectado a socket");
    //       //Desconectar cliente
    //       socketService.desconectar(cliente);
    //     });
    //   }
    //FUNCION PARA ACCEDER AL FOLDER PUBLIC
    publicFolder() {
        const publicPath = path_1.default.resolve(__dirname, "../public");
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
        this.serverHttps.listen(this.port, callback);
    }
}
exports.default = Server;
