const mongoose = require('mongoose');

const atletaSchema = new mongoose.Schema({
       idEvento: String,
       nome    : String,
       apelidio: String,
       email   : String,
       telefone: String,
       cpf     : String,
       dataNascimento: Date,
       cep     : String,
       endereco: String,
       numero  : String,
       complemento: String,
       bairro  : String,
       cidade  : String,
       uf      : String,
       rankNordestino: Number,
       rankEstadual: Number,
       idadeAno: Number,
       cabecaChave: Boolean,
})
  
const Atleta = mongoose.model('Atleta', atletaSchema);

module.exports = Atleta;