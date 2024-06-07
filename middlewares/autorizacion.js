import dotenv  from 'dotenv';
import jsonwebtoken from 'jsonwebtoken'; //Ayuda a generar tokens
import { usuarios } from '../app/controllers/autenticacion.controller.js';

dotenv.config();

function soloAdmin(req, res, next){
    const logueado = revisarCookie(req);

    if(logueado){
        return next(); //La funcion next permite seguir con el proceso del middleware
    } else {
        return res.redirect("/")
    }
}

function soloPublico(req, res, next){
    const logueado = revisarCookie(req);

    if(!logueado){
        return next(); //La funcion next permite seguir con el proceso del middleware
    } else {
        return res.redirect("/admin")
    }
}

function revisarCookie(req){
try {
    const cookieJWT= req.headers.cookie.split("; ").find(cookie => cookie.startsWith("jwt=")).slice(4); //Obtener contenido de la cookie
    const decodificado= jsonwebtoken.verify(cookieJWT, process.env.JWT_SECRET);
    console.log(decodificado);
    //Revisar el usuario
    const usuarioExiste = usuarios.find(usuario => usuario.user === decodificado.user);
    console.log(usuarioExiste);
     if (!usuarioExiste) { //Puede llegar a fallar si hay mas de un res
        return false; //Los msjs de error deben de ser discretos.
    }  
    return true;
} catch {
    return false;
}

    
}

export const methods= {
    soloAdmin,
    soloPublico,
    revisarCookie

}