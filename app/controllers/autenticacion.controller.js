import bcryptjs from "bcryptjs"; //Sirve para el cifrado de contraseñas
import jsonwebtoken from 'jsonwebtoken'; //Ayuda a generar tokens
import dotenv from 'dotenv'; //Ayuda a hacer variables de entorno.

dotenv.config(); //Acceder a las variables de entorno;

//Simnulacion de una BD
export const usuarios = [{
    user: 'test',
    email: 'test@gmail.com',
    password: '$2a$05$0y.cPLgoo4.ISyRNlI8/B.v.BaibjBaF/IJrijXynjnG4GLvkwCDS'
}]

async function Login(req, res) { //Siempre debe recibir como parametros req y res y deben de ser asyncronas
    console.log(req.body);

    const user = req.body.user;
    const password = req.body.password;

    if (!user || !password) {
        return res.status(400).send({ status: 'error', message: 'Los campos estan incompletos' })
    }

    const usuarioExiste = usuarios.find(usuario => usuario.user === user)
    if (!usuarioExiste) { //Puede llegar a fallar si hay mas de un res
        return res.status(400).send({ status: 'error', message: 'Error durante el login' }) //Los msjs de error deben de ser discretos.
    } 

    //Para comparar la contraseña de usuarios existentes.
    const loginCorrecto= await bcryptjs.compare(password, usuarioExiste.password); //Para 
    console.log(loginCorrecto);

    //Token
    if (!loginCorrecto) {
        return res.status(400).send({ status: 'error', message: 'Error durante el login' }) //Los msjs de error deben de ser discretos.
    }
     //Pero si el login esta correcto...
    const token = jsonwebtoken.sign(
        {user: usuarioExiste.user},
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRATION})  

    //CREACION DE COOKIE    
    //Opcion que permite al usuario guardar informacion ya habiendo usado el sitio.
    const cookieOption = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000), // Para convertir el tiempo en dias
        path: "/" //Parametro para poder seleccionar y borrar
    }    

    //MANDAR COOKIE AL CLIENTE
    res.cookie("jwt",token, cookieOption);
    res.send({status: "ok", message:"Usuario loggeado con exito", redirect:"/admin"})
}

//Funcionalidad en la parte del Backend
async function Registro(req, res) {
    console.log(req.body);
    //Valores que se enviaran al formulario con su respectivo valor
    const user = req.body.user;
    const email = req.body.email;
    const password = req.body.password;

    //Si alguno de los valores esta vacio
    if (!user || !email || !password) {
        return res.status(400).send({ status: 'error', message: 'Los campos estan incompletos' }) //responder
    }

    //Si algun usuario ya existe
    const usuarioExiste = usuarios.find(usuario => usuario.user === user)
    if (usuarioExiste) { //Puede llegar a fallar si hay mas de un res
        return res.status(400).send({ status: 'error', message: 'El usuario ya existe' }) //Se debe de retornar en cada respuesta
    }

    //Hash y Salt para guardar contraseñas cifradas (Deben ser asyncronico el proceso)
    const salt = await bcryptjs.genSalt(5);
    const hashPassword = await bcryptjs.hash(password, salt) //Clave criptografica del cliente

    //Nuevo Objeto de usuario
    const nuevoUsuario = {
        user, email, password: hashPassword
    }

    console.log(nuevoUsuario);

    //Agregar el usuario a la lista
    usuarios.push(nuevoUsuario);
    console.log(usuarios);
    //Mensaje de exito
    return res.status(201).send({ status: "ok", message: 'Nuevo usuario agregado', redirect: "/" })
}

//Se imnportan las funciones
export const methods = {
    Login,
    Registro
}