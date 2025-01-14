const express = require('express');
const cors = require('cors');
const knex = require('knex');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

//creamos una carpeta estática para almacenar las imagenes.
app.use('/images', express.static(path.join(__dirname, 'images')));

const db = knex({
    client: 'sqlite3',
    connection: {
        filename: 'galeria.db'
    },
    useNullAsDefault: true
});

//muestra todos los datos de la tabla obras.
app.get('/obras', async (req, res) => {
    const obra = await db('obras').select('*');
    res.status(200).json(obra);
});

//muestra todos los datos de la tabla artistas
app.get('/artistas', async (req, res) => {
    const artista = await db('artistas').select('*');
    res.status(200).json(artista);
})

//muestra datos por el parámetro id de la tabla obras 
app.get('/obras/:obraId', async (req, res) => {
    const obra = await db('obras').select('*').where({ id: req.params.obraId }).first();
    res.status(200).json(obra);
});

//muestra datos por el parámetro id de la taba artistas
app.get('/artistas/:artistaId', async (req, res) => {
    const artista = await db('artistas').select('*').where({ id: req.params.artistaId }).first();
    res.status(200).json(artista);
});

//insertar datos en la tabla obras
app.post('/obras', async (req, res) => {
    await db('obras').insert({
        nombre: req.body.nombre,
        autor: req.body.autor,
        año: req.body.año,
        estilo: req.body.estilo
    });
    res.status(201).json({});
});

//insertar datos en la tabla artistas
app.post('/artistas', async (req, res) => {
    await db('artistas').insert({
        nombre: req.body.nombre,
        pais: req.body.pais
    });
    res.status(201).json({});
});

//actualizar datos de la tabla obras
app.put('/obras/:obrasId', async (req, res) => {
    await db('obras').update({
        nombre: req.body.nombre,
        autor: req.body.autor,
        año: req.body.año,
        estilo: req.body.estilo
    }).where({ id: req.params.obrasId });
    res.status(204).json({});
});

//actualizar datos de la tabla artistas
app.put('/artistas/:artistasId', async (req, res) => {
    await db('artistas').update({
        nombre: req.body.nombre,
        pais: req.body.pais,
    }).where({ id: req.params.artistasId });
    res.status(204).json({});
});

//borrar datos de la tabla obras
app.delete('/obras/:obrasId', async (req, res) => {
    await db('obras').del().where({ id: req.params.obrasId });
    res.status(204).json({});
});

//borrar datos de la tabla artistas
app.delete('/artistas/:artistasId', async (req, res) => {
    await db('artistas').del().where({ id: req.params.artistasId });
    res.status(204).json({});
})




//muestra los datos de la tabla imagenes, que está relacionada con las tablas artistas y obras
    app.get('/imagenes/obras/:obrasId', async (req, res) => {
        try {
            const imagen = await db('imagenes')
                .join('obras', 'imagenes.obra_id', 'obras.id')
                .join('artistas', 'imagenes.artista_id', 'artistas.id')
                .select('imagenes.url as ruta_imagen', 'obras.nombre as obra_nombre', 'artistas.nombre as artista_nombre')

                .where( 'obras.id', req.params.obrasId ).first();
    
            console.log(imagen); 
    
            if (!imagen) {
                return res.status(404).json({ message: 'Imagen no encontrada' });
            }
    
            res.status(200).json(imagen);
        } catch (error) {
            console.error('Error en la consulta: ', error); 
            res.status(500).json({ message: 'Error al obtener la imagen' });
        }
    });
    


app.listen(8080, () => {
    console.log('El backend ha iniciado en el puerto 8080');
});