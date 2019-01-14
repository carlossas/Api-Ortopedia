import mysql = require ('mysql');

export default class MySQL{

    private static _instance: MySQL;

    conexion: mysql.Connection;
    conectado: boolean = false;

    constructor(){

        console.log("Clase inicializada");

        this.conexion = mysql.createConnection({
            host     : 'localhost',
            user     : 'root',
            password : 'adminadmin123',
            database : 'krusty_servicios'

        });

        this.validarConexion();


    }

    //GENERA UNA INSTANCIA DE LA CLASE, Y SI NO EXISTE CREA UNA NUEVA
    //PATRON SINGLETON
    public static get instance(){
        return this._instance || ( this._instance = new this() );
    }

    //EJECUTA UNA CONSULTA
    static ejecutarConsulta( query: string, callback: Function ){

        this.instance.conexion.query( query, (err, results: Object[], fields)=>{
            //SI ENCONTRAMOS UN ERROR DE SINTAXIS
            if(err){
                console.log("Error al ejecutar consulta", err);
                return callback(err);
            }
            //SI EL DATO BUSCADO NO EXISTE
            if(results.length === 0){
                callback('El registro no existe');
            }else{
                //TODO SALIO BIEN
                callback(null, results);
            }

        });

    }

    //VALIDAMOS LA CONEXION Y SI ES CORRECTA, ENTRAMOS
    private validarConexion(){

        this.conexion.connect( (error: mysql.MysqlError)=>{

            if(error){
                console.log("Error al conectarse: ", error.message);
                return;
            }

            this.conectado = true;
            console.log("Base de datos online MYSQL");

        });

    }
}