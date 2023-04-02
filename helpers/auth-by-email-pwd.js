import userModel from "../schemas/user-schema.js";

const authByEmailPwd = async (email, password) => {
    //filter nos sirve para saber si e4xiste o no un determinado objeto
    //find busca el objeto y nos lo retorna
    const [user] = await userModel.find({email: email}).exec();
    
    //si no estas autenticado, error 401
    //si estas autenticado pero no estas autorizado, error 403
    if (!user) {
        throw new Error();
    }

    if (user.password !== password) {
        throw new Error();
    }

    return user;
}

export default authByEmailPwd;