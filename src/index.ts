//CLASES
import Server from './server/server';
//RUTAS
import { route_index } from './router/router';
import { route_usuario } from './router/usuario';
import { route_productoUpload } from './router/productoUpload';
import { route_producto } from './router/producto';
import { route_busqueda } from './router/busqueda';
import { route_token } from './router/token';
import { route_empresa } from './router/empresa';
import { route_inventario } from './router/inventario';


/*
=======================================================================
<!-- INSTANCIA DE LA CALSE START  -->
=======================================================================
*/

const server = Server.instance;

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

server.app.use('/', route_index );
server.app.use('/', route_usuario);
server.app.use('/', route_productoUpload);
server.app.use('/', route_producto);
server.app.use('/', route_busqueda);
server.app.use('/', route_token);
server.app.use('/', route_empresa);
server.app.use('/', route_inventario)
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

server.start( () => {
    console.log(`Servidor corriendo en el puerto ${ server.port }`);
});
    
/*
=======================================================================
<!-- INICIAR EL SERVIDOR END  -->
=======================================================================
*/






