export const suma = (num1, num2) => {
    return num1 + num2; 
};

export const resta = (num1, num2) => {
    return num1 - num2; 
};

export const mult = (num1, num2) => {
    return num1 * num2; 
};

//module.exports = {suma, resta, mult}; //exports es una propiedad de module para cjs

//export {suma, resta, mult}; para mjs, podemos enviar varios elementos en el objeto pero solo podemos llamar a uno en el import (ej import {suma} from "..."), no como en cjs
//export default nombre; sirve para exportar y a la hora de importar podemos renombrar la fcion, no permite desestructurar por lo que no podemos poner {} solo el nombre
