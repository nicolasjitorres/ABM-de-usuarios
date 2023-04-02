import { Router } from "express";
import authByEmailPwd from "../helpers/auth-by-email-pwd.js";
import { SignJWT, jwtVerify } from "jose";
import userModel from "../schemas/user-schema.js";
import validateLoginDTO from "../dto/validate_login_dto.js";

// JWT --- Json Web Token
//3 requisitos:
// debe poder contener informacion
// debe poder definir la duracion de ese token
// debe de poder ser verificable, no se puede alterar sino deja de ser valido


const authTokenRouter = Router();

//Login con email y contraseña
authTokenRouter.post("/login", validateLoginDTO, async (req,res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        console.log("Debe ingresar email y contraseña.")
        return res.sendStatus(400);
    }

    try {
        const {id} = authByEmailPwd(email,password);

        const jwtConstructor = new SignJWT({ id }); //al token le ponemos id
        
        const encoder = new TextEncoder(); //nos permite codificar un texto

        const jwt = await jwtConstructor
        .setProtectedHeader({"alg": "HS256", "typ": "JWT"}) //cabecera con el algoritmo y el tipo de token (token en este caso)
        .setIssuedAt() //fecha de creacion
        .setExpirationTime("1h") //tiempo en el que expira el token
        .sign(encoder.encode(process.env.JWT_PRIVATE_KEY)); //la firma que tiene un cifrado

        return res.send({jwt});

    } catch (error) {
        return res.sendStatus(401);
    }

})


//solicitud autenticada con token para obtener el perfil del usuario, ENDPOINT de perfil
authTokenRouter.get("/profile", async (req,res) => {

    const {authorization} = req.headers;

    if (!authorization) {
        console.log("Usuario no autorizado.");
        return res.status(401);
    }

    try {
        const encoder = new TextEncoder();
        const {payload}= await jwtVerify(authorization, encoder.encode(process.env.JWT_PRIVATE_KEY));
        const user = await userModel.findById(payload.id).exec(); 

        if (!user) {
            console.log("El usuario no existe.");
            return res.sendStatus(401);
        }

        delete user.password;

        return res.send(user); //devolvemos datos del usuario autenticado

    } catch (error) {
        return res.status(401);
    }


    
})


export default authTokenRouter;