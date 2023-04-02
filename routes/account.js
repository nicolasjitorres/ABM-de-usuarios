import { Router } from "express";
import userModel from "../schemas/user-schema.js";

const accountRouter = Router();

accountRouter.use((req,res,next) => { //next es una funcion callback, es la sig funcion que tengo que ejecutar, sera alguno de los verbos (get, post, etc)
    next();
});

//API de cuentas -- ENDPOINTS

//Obtener los detalles de una cuenta a partir del id
accountRouter.get('/:id', async (req, res) => {
    const {id} = req.params;

    const user = await userModel.findById(id).exec();

    if (!user) {
        return res.status(404).send();
    }
    return res.send(user);
});

//crear una nueva cuenta a partir del id y name
accountRouter.post('/', async (req, res) => {
    const {id, name, email} = req.body;

    if (!name || !id || !email) {
        console.log("Por favor, ingrese un nombre y un id y un email.")
        return res.status(400).send();
    }

    const user = await userModel.findById(id).exec();


    if (user) {
        console.log("El usuario ya se encuentra registrado.")
        return res.status(409).send(); //en el caso de que el usuario exista, se retorna el estado 409 conflicto 
    }

    const newUser = new userModel({_id:id, name, email});
    await newUser.save();
    console.log("Usuario registrado exitosamente.")

    //USERS_BBDD.push({id,name}) //aqui agregamos el nuevo usuario
    
    return res.send();

});

//actualizar una cuenta
accountRouter.patch('/:id', async (req, res) => {
    const {id} = req.params;
    const {name} = req.body;
    
    if (!name) {
        return res.status(400).send(); //en el caso de que no hay nombre se envia este estado
    }

    const user = await userModel.findById(id).exec(); //con find buscamos el id del usuario por el id ingresado y nos devuelve el usuario (obj)

    if (!user) {
        return res.status(404).send();
    }
    
    user.name = name; //aqui actualizamos el nombre del usuario
    
    await user.save(); //aqui se guarda los datos del usuario

    return res.send(user);
});

//eliminar una cuenta
accountRouter.delete('/:id', async (req, res) => {
    const {id} = req.params; //aqui desempaquetamos el usuario solo en id
    
    const user = await userModel.findById(id).exec();
    
    if (!user) {
        return res.status(404).send();
    }

    //aqui eliminamos el usuario
    await userModel.findByIdAndRemove(id).exec();

    return res.send();
});

//un router es una miniaplicacion de express contenida en una aplicacion de express grande, nos permite agrupar y aislar un cjto de rutas


export default accountRouter;