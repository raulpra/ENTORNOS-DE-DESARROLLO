import axios from 'axios';  //importamos librería axios que nos permite comunicar con el backend
import { notifyOk, notifyError } from './dialogUtils'; //importamos libreria que nos permite lanzar mensajes de error

//para poder usar el modal a través de javascript y no de bootstrap
const myModal = new bootstrap.Modal(document.getElementById('añadirModal'));
const myModal2 = new bootstrap.Modal(document.getElementById('actualizarModal'));
const myModal3 = new bootstrap.Modal(document.getElementById('detallesModal'));
const myModal4 = new bootstrap.Modal(document.getElementById('editarModal'));

let mostrarBoton = false;

//muestra la tabla obras
window.readObras = function () {
    axios.get('http://localhost:8080/obras')
        .then((response) => {
            const obrasList = response.data;
            const obrasTable = document.getElementById('tableBody');
            obrasTable.innerHTML='';
            obrasList.forEach(obra => {
            const row = document.createElement('tr');
            row.id = 'obras-' + obra.id;
            row.innerHTML = '<td>' + obra.nombre + '</td>' +
                            '<td>' + obra.autor + '</td>' +
                            '<td>' + obra.año + '</td>' +
                            '<td>' + obra.estilo + '</td>'+
                            '<td class="text-center"><button type="button" class="btn btn-success btn-sm ' + (mostrarBoton ? '' : 'invisible' ) + '" onclick="datosObra('+ '\'' + obra.id + '\'' + ', ' + '\'' + obra.nombre + '\'' + ', ' + '\'' + obra.autor +'\''+ ', ' + '\''+ obra.año + '\'' + ', ' + '\'' + obra.estilo + '\'' +')">Modificar</button><span> </span>' +
                            '<button type="button" class="btn btn-danger btn-sm ' + (mostrarBoton ? '' : 'invisible' ) + '" onclick="removeObras(' + obra.id + ')">Eliminar</button><span> </span>'
                            +'<button type="button" class="btn btn-primary btn-sm" onclick="detalleObras(' + obra.id + ')">Detalles</button></td>';
            obrasTable.appendChild(row);
        })       
    });
};

//introduce nueva obra
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
                readObras(); 
            }
        })
        .catch ((error) =>{
            notifyError ('Error al añadir la obra');
        });      
}

//elimina obra
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

//actualiza la obra
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
                readObras();
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

//muestra los datos de la obra en un modal para poder actualizarlos
window.datosObra = function (id, nombre, autor, año, estilo) { 
    document.getElementById('idNuevo').value = id;
    document.getElementById('nombreNuevo').value = nombre;
    document.getElementById('autorNuevo').value = autor;
    document.getElementById('añoNuevo').value = año;
    document.getElementById('estiloNuevo').value = estilo;
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
        mostrarBoton = true
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

//muestra modal que nos enseña imagen, nombre y autor tomando datos de la tabla images, que está realiconada con obras y artistas
window.detalleObras = function(obraId){
    axios.get('http://localhost:8080/imagenes/obras/' + obraId)
        .then((response) => {
            if (response.status == 200) {
                
                const imagen = response.data;
                console.log(imagen);
                document.getElementById('nombreDetalle').textContent = imagen.obra_nombre;  
                document.getElementById('autorDetalle').textContent = imagen.artista_nombre;   
                document.getElementById('imagenDetalle').src = 'http://localhost:8080/images/'+imagen.ruta_imagen;    
                myModal3.show();
            }
        })
        .catch ((error) => {
            notifyError ('Error al mostrar la obra');
        });
}; 
    
