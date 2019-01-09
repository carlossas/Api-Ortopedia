import { Socket } from 'socket.io'
import socketIO from 'socket.io';

//Desconexión
export const desconectar = ( cliente: Socket )=>{

    cliente.on('disconnect', ()=>{

        
        console.log("Cliente desconectado");

        
    });

}

