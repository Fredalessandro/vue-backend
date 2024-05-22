const mongoose = require('mongoose');

// Conexão para o banco de dados de eventos
const dbevento = mongoose.createConnection('mongodb://localhost:27017/dbevento');

// Conexão para o banco de dados de geral
//const dblns = mongoose.createConnection('mongodb://localhost:27017/dblns');

module.exports = { dbevento };