"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//CLASES
const server_1 = __importDefault(require("./server/server"));
//RUTAS
const router_1 = require("./router/router");
const usuario_1 = require("./router/usuario");
const productoUpload_1 = require("./router/productoUpload");
const producto_1 = require("./router/producto");
const busqueda_1 = require("./router/busqueda");
const token_1 = require("./router/token");
const empresa_1 = require("./router/empresa");
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
server.app.use('/', usuario_1.route_usuario);
server.app.use('/', productoUpload_1.route_productoUpload);
server.app.use('/', producto_1.route_producto);
server.app.use('/', busqueda_1.route_busqueda);
server.app.use('/', token_1.route_token);
server.app.use('/', empresa_1.route_empresa);
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
