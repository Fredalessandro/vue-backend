const {Schema} = require("mongoose");
const {dbevento} = require('../config/database.js');

const usuarioSchema = new Schema({
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
  perfil: String,
  senha: String,
  ativo: Boolean,
});

const Usuario = dbevento.model("Usuario", usuarioSchema);

module.exports = Usuario;
