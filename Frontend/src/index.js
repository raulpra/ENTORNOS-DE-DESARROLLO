
import { notifyOk, notifyError } from './dialogUtils'; //importamos libreria que nos permite mandar mensajes de error


window.login = function (){ 
     
    const usuario = document.getElementById('usuario').value; 
    const password = document.getElementById('password').value; 
    if (usuario === "usuario" && password === "galeria") { 
        window.location.href="obras.html"; 
    } else { 
        notifyError('Datos incorrectos');
    } 
}