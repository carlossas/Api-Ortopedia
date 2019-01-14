//CLASES
import Server from './server/server';
//RUTAS
import { route_index } from './router/router';
import { route_mysql } from './router/test';



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
server.app.use('/', route_mysql );

    
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






