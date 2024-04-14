const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const usuarioController = require('./controllers/usuario/usuarioController');
const categoriaController = require('./controllers/categoria/categoriaController');
const bateriaController = require('./controllers/bateria/bateriaController');
const atletaController = require('./controllers/atleta/atletaController');
const eventoController = require('./controllers/evento/eventoController');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/datamongo');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erro de conexão com o MongoDB:'));
db.once('open', () => {
  console.log('Conectado ao MongoDB.');
});

app.get('/usuarios', usuarioController.getAll);
app.get('/usuarios/:atributos', usuarioController.getByAttribute);
app.post('/usuarios', usuarioController.create);
app.put('/usuarios/:id',usuarioController.atualizarUsuario);
app.post('/login', usuarioController.checkLogin);
app.delete('/usuarios/:id',usuarioController.remove);

app.get('/eventos', eventoController.getAll);
app.get('/eventos/:atributos', eventoController.getByAttribute);
app.post('/eventos', eventoController.create);
app.put('/eventos/:id',eventoController.atualizarEvento);
app.delete('/eventos/:id',eventoController.remove);

app.get('/categorias', categoriaController.getAll);
app.get('/categorias/:atributos', categoriaController.getByAttribute);
app.post('/categorias', categoriaController.create);
app.put('/categorias/:id',categoriaController.atualizarCategoria);
app.delete('/categorias/:id',categoriaController.remove);

app.get('/baterias', bateriaController.getAll);
app.get('/baterias/:atributos', bateriaController.getByAttribute);
app.post('/baterias', bateriaController.create);
app.put('/baterias/:id',bateriaController.atualizarBateria);
app.delete('/baterias/:id',bateriaController.remove);

app.get('/atletas', usuarioController.getAll);
app.get('/atletas/:atributos', usuarioController.getByAttribute);
app.post('/atletas', usuarioController.create);
app.put('/atletas/:id',usuarioController.atualizarUsuario);
app.delete('/atletas/:id',atletaController.remove);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor backend iniciado na porta ${PORT}.`);
});