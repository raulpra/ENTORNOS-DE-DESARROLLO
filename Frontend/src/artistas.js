import axios from 'axios';  //importamos librería axios que nos permite comunicar con el backend
import { notifyOk, notifyError } from './dialogUtils'; //importamos libreria que nos permite mandar mensajes de error

//para poder usar el modal a través de javascript y no de bootstrap
const myModal = new bootstrap.Modal(document.getElementById('añadirModal'));
const myModal2 = new bootstrap.Modal(document.getElementById('actualizarModal'));
const myModal4 = new bootstrap.Modal(document.getElementById('editarModal'));

let mostrarBoton = false;

//muestra la tabla artistas
window.readArtistas = function () {
    axios.get('http://localhost:8080/artistas')
        .then((response) => {
            const artistasList = response.data;
            const artistasTable = document.getElementById('tableBody');
            artistasTable.innerHTML = '';
            artistasList.forEach(artista => {
            const row = document.createElement('tr');
            row.id = 'artista-' + artista.id;
            row.innerHTML = '<td>' + artista.nombre + '</td>' +
                            '<td>' + artista.pais + '</td>' +
                            '<td class="text-center"><button type="button" class="btn btn-success btn-sm ' + (mostrarBoton ? '' : 'invisible' ) + '" onclick="datosArtista('+ '\'' + artista.id + '\'' + ', ' + '\'' + artista.nombre + '\'' + ', ' + '\'' + artista.pais + '\'' +')">Moficiar</button><span> </span>' +
                            '<button type="button" class="btn btn-danger btn-sm ' + (mostrarBoton ? '' : 'invisible' ) + '" onclick="removeArtista(' + artista.id + ')">Eliminar</button></td>';
            artistasTable.appendChild(row);
        })       
    });
};

//introduce nuevo artista
window.removeArtista = function (id) {
    axios.delete('http://localhost:8080/artistas/' + id)
        .then((response) => {
            if (response.status == 204) {
                document.getElementById('artista-' + id).remove();
                notifyOk( 'Artista elimninado');
                
            }
        })
        .catch ((error) =>{
            notifyError ('Error al eliminar el artista');
        });
};

//elimina artista
window.insertArtistas = function () {
    const nombre = document.getElementById('nombre').value;
    const pais = document.getElementById('pais').value;
    if (nombre === '' || pais === ''){
        notifyError ('Uno o más campos están vacios');
        return;
    }   
    axios.post('http://localhost:8080/artistas', {
        nombre: nombre,
        pais: pais
    })
        .then((response) => {
            if (response.status == 201) {
                notifyOk('Artista guardado');
                myModal.hide();
                readArtistas();
            }
        })
        .catch ((error) =>{
            notifyError ('Error al añadir el artista');
        });
}
    

//actualiza artista
window.updateArtista = function (){
    const id = document.getElementById('idNuevo').value; 
    const nombre = document.getElementById('nombreNuevo').value; 
    const pais = document.getElementById('paisNuevo').value;

    if (nombre === '' || pais === '') { 
        notifyError('Uno o más campos están vacíos'); 
        return; 
    }

    axios.put('http://localhost:8080/artistas/' + id,{
        nombre: nombre,
        pais:pais
    })
        .then((response) => {
            if (response.status == 204) {
                notifyOk( 'Artista actualizado');
                myModal2.hide();
                readArtistas();
            }
        })
        .catch ((error) => {
            notifyError ('Error al actualizar el artista');
        });
}

//evento para el boton crear que muestra un modal pero a través de javascript y no bootstrap, y así poder hacer que los datos se
//borren si volvemos a abrir.
botonCrear.addEventListener('click', ()=>{
    nombre.value = ''
    pais.value = ''
    myModal.show();
    
}) 

//muestra los datos de artista en un modal para poder actualizarlos
window.datosArtista = function (id, nombre, pais) { 
    document.getElementById('idNuevo').value =id;
    document.getElementById('nombreNuevo').value = nombre;
    document.getElementById('paisNuevo').value = pais;
    myModal2.show();
}

//botón Editar para mostrar las opciones de edición u ocultarlas
botonEditar.addEventListener('click', ()=>{
    usuario.value =''
    password.value = ''
    myModal4.show();
    
});

//muestra modal para tener acceso a los botones de modificar y eliminar
window.loginEditar = function (){

    const usuario = document.getElementById('usuario').value; 
    const password = document.getElementById('password').value;
    if (usuario === "usuario" && password === "galeria") {  
        mostrarBoton = true; 
        const botonesEliminar = document.querySelectorAll('.btn-danger'); 
        const botonesModificar = document.querySelectorAll('.btn-success'); 
        botonCrear.classList.remove('invisible');
        botonesEliminar.forEach(boton => { 
            boton.classList.remove('invisible'); 
        });
        botonesModificar.forEach(boton => { 
            boton.classList.remove('invisible'); 
        });  
        myModal4.hide();     
    }else{
        notifyError('Datos incorrectos');
    }
};
