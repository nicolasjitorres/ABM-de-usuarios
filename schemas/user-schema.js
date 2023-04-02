import mongoose from "mongoose";


//podemos personalizar el id, por defecto en mongoDB es _id pero lo recomendable es poner uno personalizado, para no depender de la BD
const userSchema = mongoose.Schema({
    _id: String,
    name: String,
    email: String
});

const userModel = mongoose.model('User', userSchema);

export default userModel;