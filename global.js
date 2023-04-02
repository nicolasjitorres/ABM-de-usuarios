console.clear();

import accountRouter from "./routes/account.js";
import dotenv from "dotenv"; //se importa la libreria
import authRouter from "./routes/auth.js";
import authSessionRouter from "./routes/auth_session.js";
import authTokenRouter from "./routes/auth_token.js";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import express from "express";


dotenv.config(); //metodo de la dependencia para poder utilizar los elementos del .env
const PORT = process.env.PORT;
const expressApp = express();

//middleware se encarga de ejecutar una fcion de forma previa
expressApp.use(express.json()); //este es un middleware, sirve para entender el body en formato json
expressApp.use(express.text());
expressApp.use(cookieParser());
expressApp.use("/account", accountRouter);
expressApp.use("/auth", authRouter);
expressApp.use("/auth-session", authSessionRouter);
expressApp.use("/auth-token", authTokenRouter);


const bootstrap = async () => {
    await mongoose.connect(process.env.MONGODB_URL); //aqui conectamos con la BD 
    
    //connect es una promesa, por lo que no podemos asegurar que se ejecute antes de la instruccion de abajo
    //por eso le agregamos un await para asegurarnos de que ocurra primero eso

    expressApp.listen(PORT, () => {
        console.log(`Servidor en el puerto ${PORT}`)
    }); //la manera de escuchar con express, callback es cuando tenemos una funcion dentro de otra
    
}

bootstrap();