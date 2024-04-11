const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const usuarioController = require('./controllers/usuario/usuarioController');

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

app.get('/eventos', usuarioController.getAll);
app.get('/eventos/:atributos', usuarioController.getByAttribute);
app.post('/eventos', usuarioController.create);
app.put('/eventos/:id',usuarioController.atualizarUsuario);
app.delete('/eventos/:id',usuarioController.remove);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor backend iniciado na porta ${PORT}.`);
});