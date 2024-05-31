const express = require('express');
//const https = require('https');
//const fs = require('fs');
const cors = require('cors');
const usuarioController = require('./controllers/usuario/usuarioController');
const categoriaController = require('./controllers/categoria/categoriaController');
const bateriaController = require('./controllers/bateria/bateriaController');
const athleteController = require('./controllers/athlete/athleteController');
const eventoController = require('./controllers/evento/eventoController');

const app = express();
app.use(express.json());
app.use(cors());

//startDatabase().catch(console.dir);

/*dbevento.on('error', console.error.bind(console, 'Erro de conexão com o dbevento:'));
dbevento.once('open', () => {
  console.log('Conectado ao dbevento.');
});*/

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
app.get('/event/:id',    eventoController.get);
app.get('/eventValid/:filtro',    eventoController.eventValid);
app.post('/events',           eventoController.create);
app.put('/events/:id',        eventoController.atualizar);
app.delete('/events/:id',     eventoController.remove);

app.get('/categorys',            categoriaController.getAll);
app.get('/category/:id',    categoriaController.get);
app.get('/categorys/:atributos', categoriaController.getByAttribute);
app.post('/categorys',           categoriaController.create);
app.put('/categorys/:id',        categoriaController.atualizar);
app.delete('/categorys/:id',     categoriaController.remove);

app.get('/baterias',            bateriaController.getAll);
app.get('/baterias/:atributos', bateriaController.getByAttribute);
app.post('/baterias',           bateriaController.create);
app.post('/baterias/gerar',     bateriaController.gerar);
app.put('/baterias/:id',        bateriaController.atualizar);
app.delete('/baterias/:id',     bateriaController.remove);

app.get('/athletes',             athleteController.getAll);
app.get('/athlete/:id',         athleteController.get);
app.get('/athleteFiltro/:filtro',    athleteController.filtro);
app.get('/athletes/:atributos',  athleteController.getByAttribute);
app.post('/athletes',            athleteController.create);
app.put('/athletes/:id',         athleteController.atualizar);
app.delete('/athletes/:id',      athleteController.remove);



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