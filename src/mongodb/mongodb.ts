import  mongoose from 'mongoose';

export default class MongoDB{

    private static _instance: MongoDB;
    conexion: any;
    conectado: boolean = false;

    constructor(){

        console.log("Clase inicializada");
        const URL = 'mongodb://krustyowner:krustyistheking2019@localhost:27017/krusty_servicios';

        //DATOS DE CONEXION
        let options = {
            useNewUrlParser: true,
            useCreateIndex: true
        }

        this.conectar(URL, options);
 

    }

    //GENERA UNA INSTANCIA DE LA CLASE, Y SI NO EXISTE CREA UNA NUEVA
    //PATRON SINGLETON
    public static get instance(){
        return this._instance || ( this._instance = new this() );
    }

    //
    static obtenerTodos(schema:any, desde:number, callback: Function){
        //CREAMOS UNA INSTANCIA
        this.instance.conexion;
        //BUSQUEDA Y CAMPOS QUE DESEA OBTENER, SI NO SE DEFINE DEVUELVE TODOS LOS CAMPOS
        schema
            .find({})
            .skip(desde)
            .limit(5)
            .exec(
                (err:any, datos:any) => {
    
                    if (err) {
                        return callback(err);
                    }
    
                    schema.count({}, (err:any, conteo:any) => {
                        //TODO SALIO BIEN
                        callback(null, 
                            datos,
                            conteo
                        );
                        
                    })
    
                });
    }
    
    //VALIDAMOS LA CONEXION Y SI ES CORRECTA, ENTRAMOS
    private conectar(URL:string, options:any){

        this.conexion = mongoose.connect(URL, options, (err)=>{
            if (err) throw err;
            else{
                console.log("BASE DE DATOS ONLINE MONGO DB");
                this.conectado = true;
            }
        });

    }
}