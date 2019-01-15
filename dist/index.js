"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//CLASES
const server_1 = __importDefault(require("./server/server"));
//RUTAS
const router_1 = require("./router/router");
const test_1 = require("./router/test");
const upload_1 = require("./router/upload");
/*
=======================================================================
<!-- INSTANCIA DE LA CALSE START  -->
=======================================================================
*/
const server = server_1.default.instance;
/*
=======================================================================
<!-- INSTANCIA DE LA CLASE END  -->
=======================================================================
*/
/*
=======================================================================
<!-- RUTAS DE LA API START  -->
=======================================================================
*/
server.app.use('/', router_1.route_index);
server.app.use('/', test_1.route_mysql);
server.app.use('/', upload_1.route_upload);
/*
=======================================================================
<!-- RUTAS DE LA CLASE END  -->
=======================================================================
*/
/*
=======================================================================
<!-- INICIAR EL SERVIDOR START  -->
=======================================================================
*/
server.start(() => {
    console.log(`Servidor corriendo en el puerto ${server.port}`);
});
/*
=======================================================================
<!-- INICIAR EL SERVIDOR END  -->
=======================================================================
*/
