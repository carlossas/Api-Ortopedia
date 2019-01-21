"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//Desconexión
exports.desconectar = (cliente) => {
    cliente.on('disconnect', () => {
        console.log("Cliente desconectado");
    });
};
