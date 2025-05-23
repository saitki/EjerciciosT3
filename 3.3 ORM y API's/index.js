import express from 'express';
import dotenv from 'dotenv';
import { MongoClient, ObjectId  } from "mongodb";

dotenv.config();
const app = express();
const PORT = 3000;
const uri = process.env.uri;

const client = new MongoClient(uri);
const database = client.db('test');
const usuarios = database.collection('usuarios');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


app.post('/usuarios', async (req, res) => {
    try {
        const { nombre, edad, correo } = req.body;
        const ahora = new Date();
        const formtUsuario = {
            nombre,
            edad: parseInt(edad), 
            correo,
            createdAt: ahora,
            updatedAt: ahora,
            __v: 0 
        };
        const usuario = await usuarios.insertOne(formtUsuario);
        res.status(201).json(usuario);
    } catch (error) {
        console.error('Error al crear el usuario: ', error);
        res.status(500).json({ message: 'Error al crear el usuario' });
    }

});


app.get('/usuarios', async (req, res) => {
    try {
        const usuario = await usuarios.find().toArray();
        res.status(200).json(usuario);
    } catch (error) {
        console.error('Error al obtener los usuarios: ', error);
        res.status(500).json({ message: 'Error al obtener los usuarios' });

    } 
});


app.get('/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await usuarios.findOne({_id: new ObjectId(id)});
        res.status(200).json(usuario);
    } catch (error) {
        console.error('Error al obtener los usuarios: ', error);
        res.status(500).json({ message: 'Error al obtener los usuarios' });
    } 
});
app.put('/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, edad, correo, createdAt } = req.body;
        const ahora = new Date();
        const formtUsuario = {
            nombre,
            edad: parseInt(edad), 
            correo,
            updatedAt: ahora,
            __v: 0 
        };
        const usuario = await usuarios.updateOne({ 
            _id: new ObjectId(id) },   
            { $set: formtUsuario }  );
        if(!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        const usuarioActualizado = await usuarios.findOne({
            _id: new ObjectId(id)
        });
        res.status(200).json(usuarioActualizado);
        console.log(usuarioActualizado);
    } catch (error) {
        console.error('Error al obtener los usuarios: ', error);
        res.status(500).json({ message: 'Error al obtener los usuarios' });
        
    }
});
app.delete('/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await usuarios.deleteOne({_id: new ObjectId(id)}, req.body);
        if(!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json("Usuario eliminado");
    } catch (error) {
        console.error('Error al obtener los usuarios: ', error);
        res.status(500).json({ message: 'Error al obtener los usuarios' });
        
    }
});
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);

});