import axios from 'axios';  //importamos librería axios que nos permite comunicar con el backend

//para poder usar el modal a través de javascript y no de bootstrap
const myModal = new bootstrap.Modal(document.getElementById('exampleModal'))

window.readArtistas = function () {
    axios.get('http://localhost:8080/artistas')
        .then((response) => {
            const artistasList = response.data;
            const artistasTable = document.getElementById('tableBody');
        
        artistasList.forEach(artista => {
            const row = document.createElement('tr');
            row.id = 'artista-' + artista.id;
            row.innerHTML = '<td>' + artista.nombre + '</td>' +
                            '<td>' + artista.pais + '</td>' ;
            artistasTable.appendChild(row);
        })       
    });
};


window.insertArtistas = function () {
    const nombre = document.getElementById('nombre').value;
    const pais = document.getElementById('pais').value;

    axios.post('http://localhost:8080/artistas', {
        nombre: nombre,
        pais: pais
    })
}

//evento para el boton crear que muestra un modal pero a través de javascript y no bootstrap, y así poder hacer que los datos se
//borren si volvemos a abrir.
botonCrear.addEventListener('click', ()=>{
    nombre.value = ''
    pais.value = ''
    myModal.show();
}) 

