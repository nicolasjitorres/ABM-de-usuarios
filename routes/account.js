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
        console.log("El usuario no existe");
        return res.status(404).send();
    }
    return res.send(`Nombre: ${user.name}, Email: ${user.email}`);
});

//crear una nueva cuenta a partir del id y name
accountRouter.post('/', async (req, res) => {
    const {id, name, email, password} = req.body;

    if (!name || !id || !email || !password) {
        console.log("Por favor, ingrese un nombrem, un id, un email y una contraseña.")
        return res.status(400).send();
    }

    const user = await userModel.findById(id).exec();


    if (user) {
        console.log("El usuario ya se encuentra registrado.")
        return res.status(409).send(); //En el caso de que el usuario exista, se retorna el estado 409 conflicto
    }

    const newUser = new userModel({_id:id, name, email, password});
    await newUser.save(); //Guardamos el usuario, utilizamos un await para esperar que termine este proceso


    console.log("Usuario registrado exitosamente.")
    
    return res.send();

});

// Actualizar una cuenta existente
accountRouter.patch('/:id', async (req, res) => {
    const {id} = req.params;
    const {name} = req.body;
    
    if (!name) {
        console.log("Por favor, ingrese el nombre que desea actualizar.");
        return res.status(400).send(); //en el caso de que no hay nombre se envia este estado
    }

    const user = await userModel.findById(id).exec(); //con find buscamos el id del usuario por el id ingresado y nos devuelve el usuario (obj)

    if (!user) { //si no existe el usuario, devolvemos el error 404 no encontrado
        console.log("El usuario ingresado no existe.");
        return res.status(404).send();
    }
    
    user.name = name; //aqui actualizamos el nombre del usuario
    
    await user.save(); //aqui se guarda los datos del usuario

    console.log("Usuario actualizado exitosamente");
    return res.send(user);
});

//Eliminar una cuenta deseada
accountRouter.delete('/:id', async (req, res) => {
    const {id} = req.params; //aqui desempaquetamos el usuario solo en id
    
    const user = await userModel.findById(id).exec();
    
    if (!user) {
        console.log("Usuario no existente.");
        return res.status(404).send();
    }

    //aqui eliminamos el usuario
    await userModel.findByIdAndRemove(id).exec();
    console.log("Usuario eliminado exitosamente.");
    return res.send();
});

//un router es una miniaplicacion de express contenida en una aplicacion de express grande, nos permite agrupar y aislar un cjto de rutas


export default accountRouter;