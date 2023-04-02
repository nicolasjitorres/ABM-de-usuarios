import { Router } from "express";
import authByEmailPwd from "../helpers/auth-by-email-pwd.js";
import { nanoid } from "nanoid";
import userModel from "../schemas/user-schema.js";

const sessions = [];

const authSessionRouter = Router(); //aqui generamos un arreglo de sesiones para ir pusheandolas a medida que se autentican los usuarios

//login con email y contraseña --- este es un endpoint
authSessionRouter.post("/login", (req,res) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return res.sendStatus(400);
    }

    try {
        
        const {id} = authByEmailPwd(email,password);
        
        const sessionID = nanoid(); //nanoid nos permite generar id aleatorios
        
        sessions.push({sessionID, id}); //pusheamos sesiones y el id del usuario


        //permite escribir la cookie que queremos enviar en la cabecera.
        //nombre de la cookie, valor, parametro de opciones
        res.cookie("sessionID", sessionID, { 
            httpOnly: true //sirve para cuando la cookie este en el navegador el cliente no podra leer la cookie mediante js
        });
        return res.send();

    } catch (error) {
        return res.sendStatus(401);
        
    }

})

//solicitud autenticada con sesion para obtener el perfil del usuario
authSessionRouter.get("/profile", async (req,res) => {
    const {cookies} = req;

    if (!cookies.sessionID) { //verificamos si existe la sesion en la cookie
        return res.send(401);
    }

    // verificamos si el idSesion del usuario es la misma que la idSesion de la cookie
    const userSession = sessions.find((session) => session.sessionID === cookies.sessionID);

    if (!userSession) {
        return res.sendStatus(401);
    }

    const user = await userModel.findById(id).exec(); //buscamos al usuario

    if (!user) {
        return res.sendStatus(401);
    }

    delete user.password;

    return res.send(user); //devolvemos datos del usuario autenticado
})

//crear un endpoint para cerrar sesion, se borra el sesion id en su sesion y en el array de sesiones, y se setea la cookie del navegador en vacio


export default authSessionRouter;

