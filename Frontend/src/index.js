import axios from 'axios';  //importamos librería axios que nos permite comunicar con el backend
import { notifyOk, notifyError } from './dialogUtils'; //importamos libreria que nos permite lanzar mensajes de error

//para poder usar el modal a través de javascript y no de bootstrap
const myModal = new bootstrap.Modal(document.getElementById('añadirModal'));
const myModal2 = new bootstrap.Modal(document.getElementById('actualizarModal'));

window.readObras = function () {
    axios.get('http://localhost:8080/obras')
        .then((response) => {
            const obrasList = response.data;
            const obrasTable = document.getElementById('tableBody');
        
        obrasList.forEach(obra => {
            const row = document.createElement('tr');
            row.id = 'obras-' + obra.id;
            row.innerHTML = '<td>' + obra.nombre + '</td>' +
                            '<td>' + obra.autor + '</td>' +
                            '<td>' + obra.año + '</td>' +
                            '<td>' + obra.estilo + '</td>'+
                            '<td class="text-center"><button type="button" class="btn btn-success btn-sm" onclick="datosObra('+ '\'' + obra.id + '\'' + ', ' + '\'' + obra.nombre + '\'' + ', ' + '\'' + obra.autor +'\''+ ', ' + '\''+ obra.año + '\'' + ', ' + '\'' + obra.estilo + '\'' +')">Modificar</button><span> </span>' +
                            '<button type="button" class="btn btn-danger btn-sm" onclick="removeObras(' + obra.id + ')">Eliminar</button></td>';
            obrasTable.appendChild(row);
        })       
    });
};


window.insertObras = function () {
    const nombre = document.getElementById('nombre').value;
    const autor = document.getElementById('autor').value;
    const año = document.getElementById('año').value;
    const estilo = document.getElementById('estilo').value;
    
    if (nombre === '' || autor === '' || año ==='' || estilo ===''){
        notifyError ('Uno o más campos están vacios');
        return;
    }
    
    axios.post('http://localhost:8080/obras', {
        nombre: nombre,
        autor: autor,
        año: año,
        estilo: estilo
    })
        .then((response) => {
            if (response.status == 201) {
                notifyOk('Obra guardada');
                myModal.hide();
            }
        })
        .catch ((error) =>{
            notifyError ('Error al añadir la obra');
        });      
}

window.removeObras = function (id) {
    axios.delete('http://localhost:8080/obras/' + id)
        .then((response) => {
            if (response.status == 204) {
                document.getElementById('obras-' + id).remove();
                notifyOk('Obra eliminada');
            }
        })
        .catch ((error) =>{
            notifyError ('Error al eliminar la obra');
        });
};

window.updateObra = function (){
    const id = document.getElementById('idNuevo').value;
    const nombre = document.getElementById('nombreNuevo').value;
    const autor = document.getElementById('autorNuevo').value;
    const año = document.getElementById('añoNuevo').value;
    const estilo = document.getElementById('estiloNuevo').value;

    if (nombre === '' || autor === '' || año ==='' || estilo ==='') { 
        notifyError('Uno o más campos están vacíos'); 
        return; 
    }

    axios.put('http://localhost:8080/obras/' + id,{
        nombre: nombre,
        autor: autor,
        año: año,
        estilo: estilo
    })
        .then((response) => {
            if (response.status == 204) {
                notifyOk( 'Obra actualizada');
                myModal2.hide();
            }
        })
        .catch ((error) => {
            notifyError ('Error al actualizar la obra');
        });
}; 


//evento para el boton crear que muestra un modal pero a través de javascript y no bootstrap, y así poder hacer que los datos se
//borren si volvemos a abrir.
botonCrear.addEventListener('click', ()=>{
    nombre.value = ''
    autor.value = ''
    año.value = ''
    estilo.value = ''
    myModal.show();
}) 

window.datosObra = function (id, nombre, autor, año, estilo) { 
    document.getElementById('idNuevo').value = id;
    document.getElementById('nombreNuevo').value = nombre;
    document.getElementById('autorNuevo').value = autor;
    document.getElementById('añoNuevo').value = año;
    document.getElementById('estiloNuevo').value = estilo;
    myModal2.show();
}