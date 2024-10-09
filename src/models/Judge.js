const {Schema} = require("mongoose");
const {dbevento} = require('../config/database.js');

const judgeSchema = new Schema({
  idUsuario:String,
  idEvento:String,
  nome: String,
  login: String,
  email: String,
  cpf: String,
  telefone: String,
  dataNascimento: Date, 
  sexo: String,
  tipo: String,
  atuarNoEvento: String,
  perfil: String,
  senha: String,
  ativo: Boolean,
  robo: Boolean,
});

const Judge = dbevento.model("Judge", judgeSchema);

module.exports = Judge;
