import axios from 'axios';  //importamos librería axios que nos permite comunicar con el backend

//para poder usar el modal a través de javascript y no de bootstrap
const myModal = new bootstrap.Modal(document.getElementById('exampleModal'))

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
                            '<td class="text-center"><button type="button" class="btn btn-success btn-sm">Actualizar</button><span> </span>' +
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
    axios.post('http://localhost:8080/obras', {
        nombre: nombre,
        autor: autor,
        año: año,
        estilo: estilo
    })
    .then(()=> location.reload())
}

window.removeObras = function (id) {
    axios.delete('http://localhost:8080/obras/' + id)
        .then((response) => {
            if (response.status == 204) {
                document.getElementById('obras-' + id).remove();
            }
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