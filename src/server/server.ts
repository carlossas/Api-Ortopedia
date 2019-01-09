
//LIBRERIA EXPRESS
import express from 'express';
//VARIABLES GLOBALES (PUERTO)
import { SERVER_PORT } from '../global/environment';
//LIBRERIA SOCKETS
import socketIO from 'socket.io';
//HTTP
import http from 'http';
//CORS( Configura quien puede realizar pedidos a la api )
import cors from 'cors';
//BODY PARSER ( Permite usar envio de formularios en JSON )
import bodyParser from 'body-parser';
//PATH
import path from 'path';
//FUNCIONES DE SOCKET
import * as socketService from '../sockets/sockets'

export default class Server {
    private static _instance: Server;

    public app: express.Application;
    public port: number;
    public io: socketIO.Server;
    private httpServer : http.Server;


    private constructor() {
        //SERVIDOR EXPRESS
        this.app = express();
        //PUERTO DE LA APP
        this.port = SERVER_PORT;
        //SERVIDOR HTTP
        this.httpServer = new http.Server( this.app );
        //OBJETO IO DE SOCKET
        this.io = socketIO( this.httpServer );
        //OPCIONES DE CORS
        this.cors();
        //BODY PARSE
        this.bodyParser();
        //INICIAR EL SERVICIO DE SOCKET
        this.escucharSockets();
        //CONTENIDO HTML
        this.publicFolder();
    }

    //RETORNA LA INSTANCIA DE LA CLASE O CREA UNA NUEVA SI NO EXISTE
    public static get instance(){
        return this._instance || ( this._instance = new this() );
    }

    //ESCUCHAR SOCKETS
    private escucharSockets(){
        console.log("escuchando conexiones");
        this.io.on('connection', (cliente: any) =>{

            console.log("conectado a socket");
              

            //Desconectar cliente
            socketService.desconectar( cliente );

        });
    }
    
    //FUNCION PARA ACCEDER AL FOLDER PUBLIC
    private publicFolder(){
        const publicPath = path.resolve(__dirname, '../public');
        this.app.use( express.static(publicPath) );
    }

    //BODYPARSE 
    private bodyParser(){
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(bodyParser.json());
    }

    //CONFIGURACION DE CORS
    private cors(){
        this.app.use( cors({ origin: true, credentials: true  }) );
    }

    //INICIAR EL SERVIDOR
    start( callback: Function ) {
        
        this.httpServer.listen( this.port, callback );

    }

}