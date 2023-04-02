import { Router } from "express";
import authByEmailPwd from "../helpers/auth-by-email-pwd.js";
const authRouter = Router();



//endpoint publico (autenticado y no autorizado)
authRouter.get("/publico", (req,res)=>{
    res.send("Endpoint publico");
});


//endpoint autenticado para todo usuario
authRouter.post("/autenticado", (req,res) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return res.send(400);
    }

    try {
        const user = authByEmailPwd(email, password);
        
        return res.send(`Usuario ${user.name} autenticado.`)
        
    } catch (error) {
        return res.send(401);
    }

})


//endpoint autorizado a admins
authRouter.post("/autorizado", (req,res) =>{

    const {email, password} = req.body;

    if (!email || !password) {
        return res.send(400);
    }

    try {
        const user = authByEmailPwd(email, password);
    
        if (user.role !== "admin") {
            return res.send("Usuario no autorizado");
        }
    
        return res.send(`Administrador ${user.name}`);
        
    } catch (error) {
        return res.send(401);
    }

})


export default authRouter;