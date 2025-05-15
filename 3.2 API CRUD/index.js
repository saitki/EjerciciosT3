import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Usuario from './models/usuario.model.js';


dotenv.config();
const app = express();
const PORT = 3000;
const uri = process.env.uri;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect(uri)
    .then(() => {
        console.log('Conexion exitosa a la base de datos');
    }).catch((error) => {
        console.error('Error al conectar a la base de datos: ', error);
    });

app.post('/usuarios', async (req, res) => {
    try {
        const usuario = await Usuario.create(req.body);
        res.status(201).json(usuario);
    } catch (error) {
        console.error('Error al crear el usuario: ', error);
        res.status(500).json({ message: 'Error al crear el usuario' });
    }

});


app.get('/usuarios', async (req, res) => {
    try {
        const usuarios = await Usuario.find();
        res.status(200).json(usuarios);
    } catch (error) {
        console.error('Error al obtener los usuarios: ', error);
        res.status(500).json({ message: 'Error al obtener los usuarios' });
        
    }
});

app.get('/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const usuarios = await Usuario.findById(id);
        res.status(200).json(usuarios);
    } catch (error) {
        console.error('Error al obtener los usuarios: ', error);
        res.status(500).json({ message: 'Error al obtener los usuarios' });
        
    }
});
app.put('/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const usuarios = await Usuario.findByIdAndUpdate(id, req.body);
        if(!usuarios) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        const usuarioActualizado = await Usuario.findById(id);
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
        const usuarios = await Usuario.findByIdAndDelete(id, req.body);
        if(!usuarios) {
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