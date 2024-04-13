const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({
  idEvento:String,
  nome: String,
  login: String,
  email: String,
  telefone: String,
  tipo: String,
  perfil: String,
  senha: String,
  ativo: Boolean,
});

const Usuario = mongoose.model("Usuario", usuarioSchema);

module.exports = Usuario;
