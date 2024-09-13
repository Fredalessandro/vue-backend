const express = require('express');
const mongoose = require('mongoose');
const usuarioController = require('./controllers/usuario/usuarioController');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/meuBancoDeDados', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erro de conexão com o MongoDB:'));
db.once('open', () => {
  console.log('Conectado ao MongoDB.');
});

app.get('/usuarios', usuarioController.getAll);
app.post('/usuarios', usuarioController.create);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor backend iniciado na porta ${PORT}.`);
});