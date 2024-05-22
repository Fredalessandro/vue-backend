const express = require('express');
//const https = require('https');
//const fs = require('fs');
const cors = require('cors');
const {dbevento} = require('./config/database.js');
const usuarioController = require('./controllers/usuario/usuarioController');
const categoriaController = require('./controllers/categoria/categoriaController');
const bateriaController = require('./controllers/bateria/bateriaController');
const atletaController = require('./controllers/atleta/atletaController');
const eventoController = require('./controllers/evento/eventoController');

const app = express();
app.use(express.json());
app.use(cors());


dbevento.on('error', console.error.bind(console, 'Erro de conexão com o dbevento:'));
dbevento.once('open', () => {
  console.log('Conectado ao dbevento.');
});

/*dblns.on('error', console.error.bind(console, 'Erro de conexão com o dblns:'));
dblns.once('open', () => {
  console.log('Conectado ao dblns.');
});*/


app.get('/users',       usuarioController.getAll);
app.get('/users/:atributos', usuarioController.getByAttribute);
app.get('/user/:id',    usuarioController.user);
app.get('/userFiltro/:filtro',    usuarioController.userFiltro);
app.post('/users',      usuarioController.create);
app.put('/users/:id',   usuarioController.updateUser);
app.post('/login',      usuarioController.checkLogin);
app.delete('/users/:id',usuarioController.remove);


app.get('/events',            eventoController.getAll);
app.get('/events/:atributos', eventoController.getByAttribute);
app.get('/event/:id',    eventoController.event);
app.post('/events',           eventoController.create);
app.put('/events/:id',        eventoController.atualizarEvento);
app.delete('/events/:id',     eventoController.remove);

app.get('/categorias',            categoriaController.getAll);
app.get('/categorias/:atributos', categoriaController.getByAttribute);
app.post('/categorias',           categoriaController.create);
app.put('/categorias/:id',        categoriaController.atualizarCategoria);
app.delete('/categorias/:id',     categoriaController.remove);

app.get('/baterias',            bateriaController.getAll);
app.get('/baterias/:atributos', bateriaController.getByAttribute);
app.post('/baterias',           bateriaController.create);
app.post('/baterias/gerar',     bateriaController.gerarBaterias);
app.put('/baterias/:id',        bateriaController.atualizarBateria);
app.delete('/baterias/:id',     bateriaController.remove);

app.get('/atletas',             atletaController.getAll);
app.get('/atletas/:atributos',  atletaController.getByAttribute);
app.post('/atletas',            atletaController.create);
app.put('/atletas/:id',         atletaController.atualizarAtleta);
app.delete('/atletas/:id',      atletaController.remove);



const PORT = process.env.PORT || 3000;
// Configuração do certificado autoassinado
//console.log(process.cwd());
//const privateKey = fs.readFileSync(process.cwd()+'/private-key.pem', 'utf8');
//const certificate = fs.readFileSync(process.cwd()+'/certificate.pem', 'utf8');
//const credentials = { key: privateKey, cert: certificate };

// Criação do servidor HTTPS
////const httpsServer = https.createServer(credentials, app);



// Inicia o servidor HTTPS
//httpsServer.listen(PORT, () => {
  //console.log(`Servidor HTTPS rodando na porta ${PORT}`);
//});
app.listen(PORT, () => {
  console.log(`Servidor backend iniciado na porta ${PORT}.`);
});