import { Type } from "@sinclair/typebox"; //sirve para realizar validaciones de manera mas sencilla
import Ajv from "ajv";
import addFormats from "ajv-formats"; //agrega formatos para el ajv, como email, fecha, etc
import addErrors from "ajv-errors" //agrega una libreria para personalizar los errores



const LoginDtoSchema = Type.Object(
    {
        email: Type.String({
            format: 'email',
            errorMessage: {
                type: 'El tipo email debe ser string.',
                format: 'Email debe ser un correo electronico valido.'
            }
        }),
        password: Type.String({
            errorMessage: {
                type: 'El tipo password debe ser string.'
            }
        })
    },
    {
        additionalProperties: false,
        errorMessage: 'El formato del objeto no es valido'
    }
);

const ajv = new Ajv({allErrors: true})
addFormats(ajv, ['email']).addKeyword('kind').addKeyword('modifier'); //addKeyword() es un pequeño ajuste que se le hace a typebox para que funcione ;
addErrors(ajv);
const validate = ajv.compile(LoginDtoSchema);

const validateLoginDTO = (req, res, next) => {
    const isDTOValid = validate(req.body);

    if (!isDTOValid) {
        return res.status(400).send(ajv.errorsText(validate.errors, {separator: "\n"}));
    }
    
    next();
};

export default validateLoginDTO;