const express = require('express');
const cors = require('cors');
const knex = require('knex');

const app = express();
app.use(cors());
app.use(express.json());

const db = knex({
    client: 'sqlite3',
    connection: {
        filename: 'practica.db'
    },
    useNullAsDefault: true
});

//muestra todos los datos de la tabla obras
app.get('/obra',async (req, res)=> {
    const obra = await db('obra').select('*');
    res.json(obra);
});

//muestra datos por el parámetro id
app.get ('/obra/:obraId', async (req,res)=> {
    const obra = await db ('obra').select('*').where( {id: req.params.obraId}).first();
    res.json(obra);
    res.status(200).json(obra);
});

//insertar datos en la base de datos
app.post ('/obra', async (req,res) =>{
    await db('obra').insert({
        nombre: req.body.nombre,
        autor: req.body.autor,
        año: req.body.año, 
        estilo: req.body.estilo
    });
    res.status(201).json({});
})

app.listen(8080, () => {
    console.log('El backend ha iniciado en el puerto 8080');
});