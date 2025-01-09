const express = require('express');
const cors = require('cors');
const knex = require('knex');

const app = express();
app.use(cors());
app.use(express.json());

const db = knex({
    client: 'sqlite3',
    connection: {
        filename: 'galeria.db'
    },
    useNullAsDefault: true
});

//muestra todos los datos de la tabla obras
app.get('/obras',async (req, res)=> {
    const obra = await db('obras').select('*');
    res.status(200).json(obra);
});

//muestra todos los datos de la tabla artistas
app.get ('/artistas', async (req,res) => {
    const artista = await db ('artistas').select('*');
    res.status(200).json(artista);
})

//muestra datos por el parámetro id de la tabla obras 
app.get ('/obras/:obraId', async (req,res)=> {
    const obra = await db ('obras').select('*').where( {id: req.params.obraId}).first();
    res.status(200).json(obra);
});

//muestra datos por el parámetro id de la taba artistas
app.get ('/artistas/artistaId', async (req,res) =>{
    const artista = await db ('artistas').select('*').where ({id: req.params.obraId}).first();
    res.status(200).json(artistas);
})

//insertar datos en la tabla obras
app.post ('/obras', async (req,res) =>{
    await db('obras').insert({
        nombre: req.body.nombre,
        autor: req.body.autor,
        año: req.body.año, 
        estilo: req.body.estilo
    });
    res.status(201).json({});
})

//insertar datos en la tabla artistas
app.post ('/artistas', async (req, res) =>{
    await db('artistas').insert({
        nombre: req.body.nombre,
        pais: req.body.pais
    });
    res.status(201).json({});
})



app.listen(8080, () => {
    console.log('El backend ha iniciado en el puerto 8080');
});