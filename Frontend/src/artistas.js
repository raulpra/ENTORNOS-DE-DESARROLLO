import axios from 'axios';  //importamos librería axios que nos permite comunicar con el backend
import { notifyOk, notifyError } from './dialogUtils'; //importamos libreria que nos permite mandar mensajes de error

//para poder usar el modal a través de javascript y no de bootstrap
const myModal = new bootstrap.Modal(document.getElementById('añadirModal'));
const myModal2 = new bootstrap.Modal(document.getElementById('actualizarModal'));

window.readArtistas = function () {
    axios.get('http://localhost:8080/artistas')
        .then((response) => {
            const artistasList = response.data;
            const artistasTable = document.getElementById('tableBody');
        
        artistasList.forEach(artista => {
            const row = document.createElement('tr');
            row.id = 'artista-' + artista.id;
            row.innerHTML = '<td>' + artista.nombre + '</td>' +
                            '<td>' + artista.pais + '</td>' +
                            '<td class="text-center"><button type="button" class="btn btn-success btn-sm invisible" onclick="datosArtista('+ '\'' + artista.id + '\'' + ', ' + '\'' + artista.nombre + '\'' + ', ' + '\'' + artista.pais + '\'' +')">Moficiar</button><span> </span>' +
                            '<button type="button" class="btn btn-danger btn-sm invisible" onclick="removeArtista(' + artista.id + ')">Eliminar</button></td>';
            artistasTable.appendChild(row);
        })       
    });
};


window.removeArtista = function (id) {
    axios.delete('http://localhost:8080/artistas/' + id)
        .then((response) => {
            if (response.status == 204) {
                document.getElementById('artista-' + id).remove();
                notifyOk( 'Artista elimninado');
                location.reload();
            }
        })
        .catch ((error) =>{
            notifyError ('Error al eliminar el artista');
        });
};


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
                location.reload();
            }
        })
        .catch ((error) =>{
            notifyError ('Error al añadir el artista');
        });
}
    


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
                location.reload();
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

window.datosArtista = function (id, nombre, pais) { 
    document.getElementById('idNuevo').value =id;
    document.getElementById('nombreNuevo').value = nombre;
    document.getElementById('paisNuevo').value = pais;
    myModal2.show();
}

//botón Editar para mostrar las opciones de edición u ocultarlas
let mostrar = false;
botonEditar.addEventListener('click', ()=>{

    const botonesEliminar = document.querySelectorAll('.btn-danger'); 
    const botonesModificar = document.querySelectorAll('.btn-success'); 
    if (mostrar){   
        botonesEliminar.forEach(boton => { 
            boton.classList.add('invisible'); 
        });
        botonesModificar.forEach(boton => { 
            boton.classList.add('invisible'); 
        });
        mostrar=false;
    } else{
        botonesEliminar.forEach(boton => { 
            boton.classList.remove('invisible'); 
        });
        botonesModificar.forEach(boton => { 
            boton.classList.remove('invisible'); 
        });
        mostrar=true;
    }
});