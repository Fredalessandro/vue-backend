const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const usuarioController = require('./controllers/usuario/usuarioController');
const judgeController = require('./controllers/judge/judgeController');

const categoriaController = require('./controllers/categoria/categoriaController');
const bateriaController = require('./controllers/bateria/bateriaController');
const athleteController = require('./controllers/athlete/athleteController');
const eventoController = require('./controllers/evento/eventoController');

const corsOptions = {
  origin: ["http://192.168.1.7:8080", "http://localhost:8088"], // Permite apenas esta origem
  methods: 'GET,POST,PUT,DELETE', // Permite apenas GET e POST
  allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
  optionsSuccessStatus: 200 // Para compatibilidade com IE11
};

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Permitir todas as origens (substitua por sua origem em produção)
    methods: ['GET', 'POST','PUT','DELETE'],
  },
});

io.on('connection', (socket) => {
  
  console.log('Novo cliente conectado:', socket.id);

  // Recebe mensagens de um cliente e retransmite para todos os outros clientes conectados
  socket.on('sendNotification', (data) => {
    console.log('Mensagem recebida:', data);
    socket.broadcast.emit('receiveNotification', data); // Envia para todos, exceto para o emissor
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});

const PORT_SOCKET = process.env.PORT_SOCKET || 3001;


server.listen(PORT_SOCKET, () => {
  console.log(`Servidor socket iniciado na porta ${PORT_SOCKET}.`);
});



app.use(express.json());

//app.use(cors(corsOptions));
app.use(cors({ origin: '*' }));

app.get('/users',       usuarioController.getAll);
app.get('/users/:atributos', usuarioController.getByAttribute);
app.get('/user/:id',    usuarioController.user);
app.get('/userFiltro/:filtro',    usuarioController.userFiltro);
app.post('/users',      usuarioController.create);
app.put('/users/:id',   usuarioController.updateUser);
app.post('/login',      usuarioController.checkLogin);
app.delete('/users/:id',usuarioController.remove);

app.get('/judges',       judgeController.getAll);
app.get('/judges/:atributos', judgeController.getByAttribute);
app.get('/judge/:id',    judgeController.judge);
app.get('/judgeFiltro/:filtro',    judgeController.judgeFiltro);
app.post('/judges',      judgeController.create);
app.put('/judges/:id',   judgeController.updateJudge);
app.post('/loginjudge',      judgeController.login);
app.delete('/judges/:id',judgeController.remove);

app.get('/events',            eventoController.getAll);
app.get('/events/:atributos', eventoController.getByAttribute);
app.get('/event/:id',    eventoController.get);
app.get('/eventValid/:filtro',    eventoController.eventValid);
app.get('/eventFiltro/:filtro',    eventoController.filtro);
app.post('/events',           eventoController.create);
app.put('/events/:id',        eventoController.atualizar);
app.delete('/events/:id',     eventoController.remove);

app.get('/categorys',            categoriaController.getAll);
app.get('/category/:id',    categoriaController.get);
app.get('/categorys/:atributos', categoriaController.getByAttribute);
app.get('/categoryParaSelect/:filtro', categoriaController.getByFiltro);
app.post('/categorys',           categoriaController.create);
app.put('/categorys/:id',        categoriaController.atualizar);
app.delete('/categorys/:id',     categoriaController.remove);

app.get('/batterys',            bateriaController.getAll);
app.get('/battery/:id',         bateriaController.get);
app.get('/batterys/:filtro', bateriaController.getByAttribute);
app.post('/batterys',           bateriaController.create);
app.post('/batterys',           bateriaController.create);
app.post('/batterys/generate',  bateriaController.generate);
app.put('/batterys/:id',        bateriaController.atualizar);
app.delete('/batterys/:id',     bateriaController.remove);

app.get('/athletes',             athleteController.getAll);
app.get('/athlete/:id',         athleteController.get);
app.get('/athleteFiltro/:filtro',    athleteController.filtro);
app.get('/athletes/:atributos',  athleteController.getByAttribute);
app.post('/athletes',            athleteController.create);
app.put('/athletes/:id',         athleteController.atualizar);
app.delete('/athletes/:id',      athleteController.remove);



const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
  console.log(`Servidor backend iniciado na porta ${PORT}.`);
});