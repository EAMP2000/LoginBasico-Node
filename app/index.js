import express from 'express' //Libreria que permitira levantar el servidor
import cookieParser from 'cookie-parser';

//Fix para el dirname (Esto se puede hacer de otra manera) Para que carge el HTML
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url))
import { methods as auntenticacion} from './controllers/autenticacion.controller.js'; //Se importan el objeto de las funciones del controller
import { methods as autorizacion} from '../middlewares/autorizacion.js'; 
//Servidor
const app= express(); //Se carga instancia de express
app.set("port",3000); //se define el puerto
app.listen(app.get("port")); //que escuche el puerto
console.log("Servidor corriendo en puerto",app.get("port")); //Mostrat en consola el servidor 

//Configuracion
app.use(express.static(__dirname + '/public')) //Para que acceda a los archivos estaticos de la carpeta public
app.use(express.json()); //Para ver el cuerpo de las solicitudes (DEBE IR ANTES DE LAS RUTAS)
app.use(cookieParser()); //Para ver las cookie en la consola.

//Rutas
app.get('/',autorizacion.soloPublico,(req,res)=>res.sendFile(__dirname + "/pages/login.html")) //Esto para que carge el archivo HTML
app.get('/register',autorizacion.soloPublico, (req, res)=> res.sendFile(__dirname + '/pages/register.html')) //Ruta para que carge el registro
app.get('/admin', autorizacion.soloAdmin, (req, res)=> res.sendFile(__dirname + '/pages/admin/admin.html')) 

app.post('/api/register', auntenticacion.Registro) //Se accede a las funciones
app.post('/api/login', auntenticacion.Login) //Se accede a las funciones */



